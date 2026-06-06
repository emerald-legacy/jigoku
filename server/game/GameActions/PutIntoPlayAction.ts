import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, EventName, Location, Players } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export interface PutIntoPlayProperties extends CardActionProperties {
    fate?: number;
    status?: 'honored' | 'ordinary' | 'dishonored';
    controller?: Players;
    side?: Player;
    overrideLocation?: Location;
}

export class PutIntoPlayAction extends CardGameAction {
    name = 'putIntoPlay';
    eventName = EventName.OnCharacterEntersPlay;
    cost = 'putting {0} into play';
    targetType = [CardType.Character];
    intoConflict: boolean;
    defaultProperties: PutIntoPlayProperties = {
        fate: 0,
        status: 'ordinary',
        controller: Players.Self,
        side: undefined,
        overrideLocation: undefined
    };
    constructor(
        properties: ((context: AbilityContext) => PutIntoPlayProperties) | PutIntoPlayProperties,
        intoConflict = true
    ) {
        super(properties);
        this.intoConflict = intoConflict;
    }

    getDefaultSide(context: AbilityContext) {
        return context.player;
    }

    getPutIntoPlayPlayer(context: AbilityContext) {
        return context.player;
    }

    getEffectMessage(context: AbilityContext): MessageArgs {
        let { target } = this.getProperties(context);
        return ['put {0} into play' + (this.intoConflict ? ' in the conflict' : ''), [target]];
    }

    canAffect(card: DrawCard, context: AbilityContext): boolean {
        let properties = this.getProperties(context) as PutIntoPlayProperties;
        let contextCopy = context.copy({ source: card });
        let player = this.getPutIntoPlayPlayer(contextCopy);
        let targetSide = properties.side || this.getDefaultSide(contextCopy);

        if(!context || !super.canAffect(card, context)) {
            return false;
        } else if(!player || card.anotherUniqueInPlay(player)) {
            return false;
        } else if(card.location === Location.PlayArea || card.isFacedown()) {
            return false;
        } else if(!card.checkRestrictions('putIntoPlay', context)) {
            return false;
        } else if(!player.checkRestrictions('enterPlay', contextCopy)) {
            return false;
        } else if(this.intoConflict) {
            // There is no current conflict, or no context (cards must be put into play by a player, not a framework event)
            if(!context.game.currentConflict) {
                return false;
            }
            // card cannot participate in this conflict type
            if(card.hasDash(context.game.currentConflict.conflictType)) {
                return false;
            }
            if(!card.checkRestrictions('putIntoConflict', context)) {
                return false;
            }

            // its being put into play for its controller, & controller is attacking and character can't attack, or controller is defending and character can't defend
            if(
                (targetSide.isAttackingPlayer() && !card.canParticipateAsAttacker()) ||
                (targetSide.isDefendingPlayer() && !card.canParticipateAsDefender())
            ) {
                return false;
            }
        }
        return true;
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnCharacterEntersPlay>, card: DrawCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { fate, status, controller, side, overrideLocation } = this.getProperties(
            context,
            additionalProperties
        ) as PutIntoPlayProperties;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.fate = fate;
        event.status = status;
        event.controller = controller;
        event.intoConflict = this.intoConflict;
        event.originalLocation = overrideLocation || card.location;
        event.side = side || this.getDefaultSide(context);
    }

    eventHandler(event: GameEvent<EventName.OnCharacterEntersPlay>, additionalProperties: Record<string, unknown> = {}): void {
        const context = event.context as AbilityContext;
        let player = this.getPutIntoPlayPlayer(context);
        const card = event.card as DrawCard;
        this.checkForRefillProvince(card, event, additionalProperties);
        card.new = true;
        if(event.fate) {
            card.fate = event.fate;
        }

        let finalController = context.player;
        if(event.controller === Players.Opponent && finalController.opponent) {
            finalController = finalController.opponent;
        }

        let targetSide = event.side;

        if(event.status === 'honored') {
            card.honor();
        } else if(event.status === 'dishonored') {
            card.dishonor();
        }
        if(card.hasPrintedKeyword('corrupted')) {
            card.taint();
        }

        player.moveCard(card, Location.PlayArea);

        //moveCard sets all this stuff and only works if the owner is moving cards, so we're switching it around
        if(card.controller !== finalController) {
            card.controller = finalController;
            card.setDefaultController(card.controller);
            card.owner.cardsInPlay.splice(card.owner.cardsInPlay.indexOf(card), 1);
            card.controller.cardsInPlay.push(card);
        }

        const conflict = context.game.currentConflict;
        if(event.intoConflict && conflict) {
            if(targetSide?.isAttackingPlayer()) {
                conflict.addAttacker(card);
            } else {
                conflict.addDefender(card);
            }
        }
    }
}
