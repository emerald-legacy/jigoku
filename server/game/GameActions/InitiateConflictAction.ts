import type { AbilityContext } from '../AbilityContext.js';
import { type ConflictType, EventName } from '../Constants.js';
import type Player from '../Player.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent, ActionOverrides } from './GameAction.js';

export interface InitiateConflictProperties extends PlayerActionProperties {
    canPass?: boolean;
    forcedDeclaredType?: ConflictType;
    forceProvinceTarget?: ProvinceCard;
}

export class InitiateConflictAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<InitiateConflictProperties, EventName.OnConflictInitiated, Context, 'canPass'> {
    override name = 'initiateConflict';
    override eventName = EventName.OnConflictInitiated;
    override effect = 'declare a new conflict';
    override defaultProperties = {
        canPass: true
    };

    override canAffect(player: Player, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { forcedDeclaredType } = this.getProperties(context, additionalProperties);
        return super.canAffect(player, context) && player.hasLegalConflictDeclaration({ forcedDeclaredType });
    }


    override eventHandler(event: ActionEvent<EventName.OnConflictInitiated, Context>, additionalProperties: Record<string, unknown>): void {
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        context.game.initiateConflict(
            event.player,
            properties.canPass,
            properties.forcedDeclaredType,
            properties.forceProvinceTarget
        );
    }
}
