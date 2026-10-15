import { msg, type MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, Duration, type EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { canPlayFromOwn } from '../Effects/Library/canPlayFromOwn.js';
import { playerDelayedEffect } from '../Effects/Library/delayedEffect.js';
import { hideWhenFaceUp } from '../Effects/Library/hideWhenFaceUp.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import { type CardActionProperties, type CardEvent, CardGameAction } from './CardGameAction.js';
import { targetList, type ActionOverrides } from './GameAction.js';
import { HandlerAction } from './HandlerAction.js';

export interface SetAsideProperties<C extends AbilityContext = AbilityContext> extends CardActionProperties {
    /** Facedown to the other players while set aside. */
    hidden?: boolean;
    /** Back to the owner's hand when the conflict ends. */
    returnAtEndOfConflict?: boolean;
    /** Controls the cards and may play them as if they were in their hand while they are set aside. */
    playableBy?: Player;
    message?(context: C, cards: DrawCard[]): MessageArgs;
}

export class SetAsideAction<C extends AbilityContext = AbilityContext> extends CardGameAction<SetAsideProperties, EventName.Unnamed, C, 'hidden' | 'returnAtEndOfConflict'> {
    override name = 'setAside';
    override effect = 'set aside {0}';
    override targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
    override defaultProperties = {
        hidden: false,
        returnAtEndOfConflict: false
    };

    override canAffect(card: BaseCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        return card.location !== Location.RemovedFromGame && super.canAffect(card, context, additionalProperties);
    }

    override addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        const cards = targetList(properties.target).filter((card): card is DrawCard => card.isDrawCard() && this.canAffect(card, context, additionalProperties));
        if(cards.length === 0) {
            return;
        }
        if(properties.message) {
            context.game.addMessage(properties.message(context, cards));
        }
        // the cards just chosen, even if the target is random
        super.addEventsToArray(events, context, { ...additionalProperties, target: cards });
        if(properties.returnAtEndOfConflict) {
            this.#returnAtEndOfConflict(context, cards);
        }
    }

    override eventHandler(event: CardEvent<EventName.Unnamed, C>, additionalProperties: ActionOverrides = {}): void {
        const context = event.context;
        const card = event.card;
        if(!card.isDrawCard()) {
            return;
        }
        const { hidden, playableBy } = this.getProperties(context, additionalProperties);
        if(playableBy) {
            card.owner.removeCardFromPile(card);
            card.controller = playableBy;
            card.moveTo(Location.RemovedFromGame);
            playableBy.removedFromGame.unshift(card);
        } else {
            card.owner.moveCard(card, Location.RemovedFromGame);
        }
        const effects = [
            ...(hidden ? [hideWhenFaceUp()] : []),
            ...(playableBy ? [canPlayFromOwn(Location.RemovedFromGame, [card], context.source)] : [])
        ];
        if(effects.length > 0) {
            context.source.lastingEffect({
                until: {
                    onCardMoved: (moved: GameEvent<EventName.OnCardMoved>) => moved.card === card && moved.originalLocation === Location.RemovedFromGame
                },
                match: card,
                effect: effects
            });
        }
    }

    #returnAtEndOfConflict(context: C, cards: DrawCard[]): void {
        for(const owner of new Set(cards.map((card) => card.owner))) {
            const own = cards.filter((card) => card.owner === owner);
            context.source.applyDurationEffect(Duration.UntilEndOfRound, {
                targetController: owner,
                effect: playerDelayedEffect({
                    when: { onConflictFinished: () => true },
                    gameAction: new HandlerAction({
                        handler: (context) => {
                            const stillAside = own.filter((card) => card.location === Location.RemovedFromGame);
                            if(stillAside.length === 0) {
                                return;
                            }
                            context.game.addMessage(msg`${owner} picks back their cards`);
                            for(const card of stillAside) {
                                owner.moveCard(card, Location.Hand);
                            }
                        }
                    })
                })
            });
        }
    }
}
