import type { AbilityContext } from '../AbilityContext.js';
import { ConflictType, EventName } from '../Constants.js';
import type Player from '../Player.js';
import { ProvinceCard } from '../ProvinceCard.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export interface InitiateConflictProperties extends PlayerActionProperties {
    canPass?: boolean;
    forcedDeclaredType?: ConflictType;
    forceProvinceTarget?: ProvinceCard;
}

export class InitiateConflictAction extends PlayerAction<InitiateConflictProperties> {
    name = 'initiateConflict';
    eventName = EventName.OnConflictInitiated;
    effect = 'declare a new conflict';
    defaultProperties: InitiateConflictProperties = {
        canPass: true
    };

    canAffect(player: Player, context: AbilityContext): boolean {
        const { forcedDeclaredType } = this.getProperties(context);
        return super.canAffect(player, context) && player.hasLegalConflictDeclaration({ forcedDeclaredType });
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    eventHandler(event: GameEvent<EventName.OnConflictInitiated>, additionalProperties: Record<string, unknown>): void {
        const context = event.context as AbilityContext;
        const properties = this.getProperties(context, additionalProperties);
        context.game.initiateConflict(
            event.player,
            properties.canPass ?? true,
            properties.forcedDeclaredType,
            properties.forceProvinceTarget
        );
    }
}
