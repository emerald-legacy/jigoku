import type BaseCard from '../BaseCard.js';
import { BaseCardSelector, type BaseCardSelectorProperties } from './BaseCardSelector.js';

export class UpToXCardSelector extends BaseCardSelector {
    override numCards: number;

    constructor(numCards: number, properties: BaseCardSelectorProperties) {
        super(properties);
        this.numCards = numCards;
    }

    override defaultActivePromptTitle(): string {
        return this.numCards === 1 ? 'Select a character' : `Select up to ${this.numCards} characters`;
    }

    override hasReachedLimit(selectedCards: BaseCard[]): boolean {
        return selectedCards.length >= this.numCards;
    }

    override hasExceededLimit(selectedCards: BaseCard[]): boolean {
        return selectedCards.length > this.numCards;
    }
}

