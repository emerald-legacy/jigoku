import type { AbilityContext } from './AbilityContext.js';
import BaseCard from './basecard.js';
import { EffectNames, Elements } from './Constants.js';
import type Player from './player.js';

const illegalActions = new Set([
    'bow',
    'ready',
    'dishonor',
    'honor',
    'sacrifice',
    'discardFromPlay',
    'moveToConflict',
    'sendHome',
    'putIntoPlay',
    'putIntoConflict',
    'break',
    'returnToHand',
    EffectNames.TakeControl,
    'placeFate',
    'removeFate'
]);

export class RoleCard extends BaseCard {
    influenceModifier = 0;
    isRole = true;

    getInfluence(): number {
        return (this.cardData.influence_pool ?? 0) + this.influenceModifier;
    }

    flipFaceup(): void {
        this.facedown = false;
    }

    getSummary(activePlayer: Player, hideWhenFaceup = false) {
        const baseSummary = super.getSummary(activePlayer, hideWhenFaceup);
        return {
            ...baseSummary,
            isRole: this.isRole,
            location: this.location
        };
    }

    allowGameAction(actionType: string, context?: AbilityContext): boolean {
        return !illegalActions.has(actionType) && super.allowGameAction(actionType, context);
    }

    getElement(): Elements[] {
        return [];
    }
}
