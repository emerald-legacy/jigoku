import type { AbilityContext } from './AbilityContext.js';
import BaseCard from './BaseCard.js';
import { EffectName, Element } from './Constants.js';
import type Player from './Player.js';

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
    EffectName.TakeControl,
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

    getElement(): Element[] {
        return [];
    }
}
