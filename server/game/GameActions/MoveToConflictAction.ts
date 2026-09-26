import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { CardType, EffectName, EventName, Location } from '../Constants.js';
import type Player from '../Player.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import type { ActionEvent } from './GameAction.js';

export interface MoveToConflictProperties extends CardActionProperties {
    side?: Player;
}

export class MoveToConflictAction<C extends AbilityContext = AbilityContext> extends CardGameAction<MoveToConflictProperties, EventName, C> {
    name = 'moveToConflict';
    eventName = EventName.OnMoveToConflict;
    cost = 'moving {0} into the conflict';
    effect = 'move {0} into the conflict';
    targetType = [CardType.Character];
    defaultProperties: MoveToConflictProperties = { side: undefined };

    canAffect(card: DrawCard, context: C): boolean {
        let properties = this.getProperties(context);
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

    addPropertiesToEvent(event: ActionEvent<EventName.OnMoveToConflict, C>, card: BaseCard, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties(context);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.side = properties.side || card.controller;
    }

    eventHandler(event: ActionEvent<EventName.OnMoveToConflict, C>): void {
        const context = event.context;
        const player = event.side as Player;
        const conflict = context.game.requireConflict();

        if(player.isAttackingPlayer()) {
            conflict.addAttacker(event.card);
        } else {
            conflict.addDefender(event.card);
        }
    }
}
