import type { AbilityContext } from '../AbilityContext.js';
import { ConflictTypes, EventNames } from '../Constants.js';
import type Player from '../player.js';
import { ProvinceCard } from '../ProvinceCard.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

import type { Event } from '../Events/Event.js';
export interface InitiateConflictProperties extends PlayerActionProperties {
    canPass?: boolean;
    forcedDeclaredType?: ConflictTypes;
    forceProvinceTarget?: ProvinceCard;
}

export class InitiateConflictAction extends PlayerAction<InitiateConflictProperties> {
    name = 'initiateConflict';
    eventName = EventNames.OnConflictInitiated;
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

    eventHandler(event: Event, additionalProperties: any): void {
        const properties = this.getProperties((event.context as AbilityContext), additionalProperties);
        (event.context as AbilityContext).game.initiateConflict(
            event.player,
            properties.canPass ?? true,
            properties.forcedDeclaredType,
            properties.forceProvinceTarget
        );
    }
}
