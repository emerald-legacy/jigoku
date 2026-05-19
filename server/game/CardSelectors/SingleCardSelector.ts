import BaseCardSelector from './BaseCardSelector.js';
import { CardTypes } from '../Constants.js';

class SingleCardSelector extends BaseCardSelector {
    numCards: number;

    constructor(properties: any) {
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

    hasReachedLimit(selectedCards: any[]): boolean {
        return selectedCards.length >= this.numCards;
    }

    hasExceededLimit(selectedCards: any[]): boolean {
        return selectedCards.length > this.numCards;
    }

    formatSelectParam(cards: any[]): any {
        return cards[0] ? cards[0] : cards;
    }
}

export default SingleCardSelector;
