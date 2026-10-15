import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { CardType, EffectName, EventName, Location, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export interface MoveToConflictProperties extends CardActionProperties {
    side?: Player;
}

export class MoveToConflictAction<C extends AbilityContext = AbilityContext> extends CardGameAction<MoveToConflictProperties, EventName.OnMoveToConflict, C> {
    name = 'moveToConflict';
    restriction = RestrictionType.MoveToConflict;
    eventName = EventName.OnMoveToConflict;
    cost = 'moving {0} into the conflict';
    effect = 'move {0} into the conflict';
    targetType = [CardType.Character];
    canAffect(card: DrawCard, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        if(!super.canAffect(card, context)) {
            return false;
        }
        if(!context.game.currentConflict || card.isParticipating()) {
            return false;
        }

        const player = properties.side || card.controller;

        if(player.isAttackingPlayer()) {
            if(!card.canParticipateAsAttacker()) {
                return false;
            }
        } else if(!card.canParticipateAsDefender()) {
            return false;
        }
        if(card.anyEffect(EffectName.ParticipatesFromHome)) {
            return false;
        }

        return card.location === Location.PlayArea;
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnMoveToConflict, C>, card: BaseCard, context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.side = properties.side || card.controller;
    }

    eventHandler(event: ActionEvent<EventName.OnMoveToConflict, C>): void {
        const context = event.context;
        const player = event.side;
        const conflict = context.game.requireConflict();

        if(player.isAttackingPlayer()) {
            conflict.addAttacker(event.card);
        } else {
            conflict.addDefender(event.card);
        }
    }
}
