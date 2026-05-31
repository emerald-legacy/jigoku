import type BaseCard from '../BaseCard.js';
import BaseCardSelector, { type BaseCardSelectorProperties } from './BaseCardSelector.js';

class UpToXCardSelector extends BaseCardSelector {
    numCards: number;

    constructor(numCards: number, properties: BaseCardSelectorProperties) {
        super(properties);
        this.numCards = numCards;
    }

    defaultActivePromptTitle(): string {
        return this.numCards === 1 ? 'Select a character' : `Select ${this.numCards} characters`;
    }

    hasReachedLimit(selectedCards: BaseCard[]): boolean {
        return selectedCards.length >= this.numCards;
    }

    hasExceededLimit(selectedCards: BaseCard[]): boolean {
        return selectedCards.length > this.numCards;
    }
}

export default UpToXCardSelector;
