import type { AbilityContext } from './AbilityContext.js';
import type { GameActionName } from './GameActions/GameActionRegistry.js';
import BaseCard from './BaseCard.js';
import { EffectName, Element, elementTrait } from './Constants.js';
import type { StateViewer } from './types/StateViewer.js';

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

    override getSummary(activePlayer: StateViewer, hideWhenFaceup = false) {
        const baseSummary = super.getSummary(activePlayer, hideWhenFaceup);
        return {
            ...baseSummary,
            isRole: this.isRole,
            location: this.location
        };
    }

    override allowGameAction(actionType: GameActionName, context: AbilityContext): boolean {
        return !illegalActions.has(actionType) && super.allowGameAction(actionType, context);
    }

    /** The elements of the role, from its traits (an Allied role has all five). */
    getElement(): Element[] {
        return Object.values(Element).filter((element) => this.hasTrait(elementTrait(element)));
    }
}
