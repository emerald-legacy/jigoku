import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../basecard.js';
import type DrawCard from '../drawcard.js';
import { CardTypes, EffectNames, EventNames, Locations } from '../Constants.js';
import type Player from '../player.js';
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

    addPropertiesToEvent(event: any, card: BaseCard, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties(context) as MoveToConflictProperties;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.side = properties.side || card.controller;
    }

    eventHandler(event: any): void {
        const player = event.side;

        if(player.isAttackingPlayer()) {
            event.context.game.currentConflict.addAttacker(event.card);
        } else {
            event.context.game.currentConflict.addDefender(event.card);
        }
    }
}
