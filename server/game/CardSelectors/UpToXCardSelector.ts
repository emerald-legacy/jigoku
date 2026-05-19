import BaseCardSelector from './BaseCardSelector.js';

class UpToXCardSelector extends BaseCardSelector {
    numCards: number;

    constructor(numCards: number, properties: any) {
        super(properties);
        this.numCards = numCards;
    }

    defaultActivePromptTitle(): string {
        return this.numCards === 1 ? 'Select a character' : `Select ${this.numCards} characters`;
    }

    hasReachedLimit(selectedCards: any[]): boolean {
        return selectedCards.length >= this.numCards;
    }

    hasExceededLimit(selectedCards: any[]): boolean {
        return selectedCards.length > this.numCards;
    }
}

export default UpToXCardSelector;
