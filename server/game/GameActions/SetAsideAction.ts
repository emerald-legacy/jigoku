import { msg, type MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, Duration, EventName, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { Effects } from '../effects.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import { type CardActionProperties, type CardEvent, CardGameAction } from './CardGameAction.js';
import { targetList, type ActionOverrides } from './GameAction.js';
import { HandlerAction } from './HandlerAction.js';

export interface SetAsideProperties extends CardActionProperties {
    /** Facedown to the other players while set aside. */
    hidden?: boolean;
    /** Back to the owner's hand when the conflict ends. */
    returnAtEndOfConflict?: boolean;
    /** Controls the cards and may play them as if they were in their hand while they are set aside. */
    playableBy?: Player;
    /** The chat line, once for all the cards. */
    message?: (context: AbilityContext, cards: DrawCard[]) => MessageArgs;
}

/** Sets cards aside, out of play (the removed-from-game pile). */
export class SetAsideAction<C extends AbilityContext = AbilityContext> extends CardGameAction<SetAsideProperties, EventName.Unnamed, C, 'hidden' | 'returnAtEndOfConflict'> {
    name = 'setAside';
    effect = 'set aside {0}';
    targetType = [CardType.Character, CardType.Attachment, CardType.Event, CardType.Holding];
    defaultProperties = {
        hidden: false,
        returnAtEndOfConflict: false
    };

    canAffect(card: BaseCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        return card.location !== Location.RemovedFromGame && super.canAffect(card, context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
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

    eventHandler(event: CardEvent<EventName.Unnamed, C>, additionalProperties: ActionOverrides = {}): void {
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
            ...(hidden ? [Effects.hideWhenFaceUp()] : []),
            ...(playableBy ? [Effects.canPlayFromOwn(Location.RemovedFromGame, [card], context.source)] : [])
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

    /** Each owner takes back their cards still set aside when the conflict ends. */
    #returnAtEndOfConflict(context: C, cards: DrawCard[]): void {
        for(const owner of new Set(cards.map((card) => card.owner))) {
            const own = cards.filter((card) => card.owner === owner);
            context.source.applyDurationEffect(Duration.UntilEndOfRound, {
                targetController: owner,
                effect: Effects.playerDelayedEffect({
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
