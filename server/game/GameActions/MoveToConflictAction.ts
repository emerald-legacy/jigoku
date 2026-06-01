import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type { Conflict } from '../Conflict.js';
import type DrawCard from '../DrawCard.js';
import { CardTypes, EffectNames, EventNames, Locations } from '../Constants.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';

export interface MoveToConflictProperties extends CardActionProperties {
    side?: Player;
}

export class MoveToConflictAction extends CardGameAction {
    name = 'moveToConflict';
    eventName = EventNames.OnMoveToConflict;
    cost = 'moving {0} into the conflict';
    effect = 'move {0} into the conflict';
    targetType = [CardTypes.Character];
    defaultProperties: MoveToConflictProperties = { side: undefined };

    canAffect(card: DrawCard, context: AbilityContext): boolean {
        let properties = this.getProperties(context) as MoveToConflictProperties;
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
        if(card.anyEffect(EffectNames.ParticipatesFromHome)) {
            return false;
        }

        return card.location === Locations.PlayArea;
    }

    addPropertiesToEvent(event: GameEvent<EventNames.OnMoveToConflict>, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties(context) as MoveToConflictProperties;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.side = properties.side || card.controller;
    }

    eventHandler(event: GameEvent<EventNames.OnMoveToConflict>): void {
        const context = event.context as AbilityContext;
        const player = event.side as Player;
        const conflict = context.game.currentConflict as Conflict;

        if(player.isAttackingPlayer()) {
            conflict.addAttacker(event.card);
        } else {
            conflict.addDefender(event.card);
        }
    }
}
