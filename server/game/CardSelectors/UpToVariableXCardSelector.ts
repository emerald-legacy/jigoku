import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import BaseCardSelector, { type BaseCardSelectorProperties, type NumCardsFunc } from './BaseCardSelector.js';

class UpToVariableXCardSelector extends BaseCardSelector {
    numCardsFunc: NumCardsFunc;

    constructor(numCardsFunc: NumCardsFunc, properties: BaseCardSelectorProperties) {
        super(properties);
        this.numCardsFunc = numCardsFunc;
    }

    defaultActivePromptTitle(context: AbilityContext): string {
        if(this.cardType.length === 1) {
            return this.numCardsFunc(context) === 1 ? 'Select a ' + this.cardType[0] : `Select up to ${this.numCardsFunc(context)} ${this.cardType[0]}s`;
        }
        return this.numCardsFunc(context) === 1 ? 'Select a card' : `Select up to ${this.numCardsFunc(context)} cards`;
    }

    hasReachedLimit(selectedCards: BaseCard[], context: AbilityContext): boolean {
        return selectedCards.length >= this.numCardsFunc(context);
    }

    hasExceededLimit(selectedCards: BaseCard[], context: AbilityContext): boolean {
        return selectedCards.length > this.numCardsFunc(context);
    }

    hasEnoughTargets(context: AbilityContext, choosingPlayer: Player): boolean {
        return this.numCardsFunc(context) > 0 && super.hasEnoughTargets(context, choosingPlayer);
    }
}

export default UpToVariableXCardSelector;
