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

export class MoveToConflictAction<Context extends AbilityContext = AbilityContext> extends CardGameAction<MoveToConflictProperties, EventName.OnMoveToConflict, Context> {
    override name = 'moveToConflict';
    override restriction = RestrictionType.MoveToConflict;
    override eventName = EventName.OnMoveToConflict;
    override cost = 'moving {0} into the conflict';
    override effect = 'move {0} into the conflict';
    override targetType = [CardType.Character];
    override canAffect(card: DrawCard, context: Context, additionalProperties: ActionOverrides = {}): boolean {
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

    override addPropertiesToEvent(event: ActionEvent<EventName.OnMoveToConflict, Context>, card: BaseCard, context: Context, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.side = properties.side || card.controller;
    }

    override eventHandler(event: ActionEvent<EventName.OnMoveToConflict, Context>): void {
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
