import type BaseCard from '../BaseCard.js';
import { CardTypes } from '../Constants.js';
import BaseCardSelector, { type BaseCardSelectorProperties } from './BaseCardSelector.js';

class SingleCardSelector extends BaseCardSelector {
    numCards: number;

    constructor(properties: BaseCardSelectorProperties) {
        super(properties);
        this.numCards = 1;
    }

    defaultActivePromptTitle(): string {
        if(this.cardType.length === 1) {
            if(this.cardType[0] === CardTypes.Attachment) {
                return 'Choose an attachment';
            }
            return 'Choose a ' + this.cardType[0];
        }
        return 'Choose a card';
    }

    automaticFireOnSelect(): boolean {
        return true;
    }

    hasReachedLimit(selectedCards: BaseCard[]): boolean {
        return selectedCards.length >= this.numCards;
    }

    hasExceededLimit(selectedCards: BaseCard[]): boolean {
        return selectedCards.length > this.numCards;
    }

    formatSelectParam(cards: BaseCard[]): BaseCard | BaseCard[] {
        return cards[0] ? cards[0] : cards;
    }
}

export default SingleCardSelector;
