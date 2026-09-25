import type { AbilityContext } from '../AbilityContext.js';
import { ConflictType, EventName } from '../Constants.js';
import type Player from '../Player.js';
import { ProvinceCard } from '../ProvinceCard.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

import type { ActionEvent } from './GameAction.js';
export interface InitiateConflictProperties extends PlayerActionProperties {
    canPass?: boolean;
    forcedDeclaredType?: ConflictType;
    forceProvinceTarget?: ProvinceCard;
}

export class InitiateConflictAction<C extends AbilityContext = AbilityContext> extends PlayerAction<InitiateConflictProperties, EventName, C> {
    name = 'initiateConflict';
    eventName = EventName.OnConflictInitiated;
    effect = 'declare a new conflict';
    defaultProperties: InitiateConflictProperties = {
        canPass: true
    };

    canAffect(player: Player, context: C): boolean {
        const { forcedDeclaredType } = this.getProperties(context);
        return super.canAffect(player, context) && player.hasLegalConflictDeclaration({ forcedDeclaredType });
    }

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    eventHandler(event: ActionEvent<EventName.OnConflictInitiated, C>, additionalProperties: Record<string, unknown>): void {
        const context = event.context;
        const properties = this.getProperties(context, additionalProperties);
        context.game.initiateConflict(
            event.player,
            properties.canPass ?? true,
            properties.forcedDeclaredType,
            properties.forceProvinceTarget
        );
    }
}
