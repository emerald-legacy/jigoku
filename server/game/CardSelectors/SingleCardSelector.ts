import type BaseCard from '../BaseCard.js';
import { CardType } from '../Constants.js';
import { BaseCardSelector, type BaseCardSelectorProperties } from './BaseCardSelector.js';

export class SingleCardSelector extends BaseCardSelector {
    override numCards: number;

    constructor(properties: BaseCardSelectorProperties) {
        super(properties);
        this.numCards = 1;
    }

    override defaultActivePromptTitle(): string {
        if(this.cardType.length === 1) {
            if(this.cardType[0] === CardType.Attachment) {
                return 'Choose an attachment';
            }
            return 'Choose a ' + this.cardType[0];
        }
        return 'Choose a card';
    }

    override automaticFireOnSelect(): boolean {
        return true;
    }

    override hasReachedLimit(selectedCards: BaseCard[]): boolean {
        return selectedCards.length >= this.numCards;
    }

    override hasExceededLimit(selectedCards: BaseCard[]): boolean {
        return selectedCards.length > this.numCards;
    }

    override formatSelectParam(cards: BaseCard[]): BaseCard | BaseCard[] {
        return cards[0] ? cards[0] : cards;
    }
}

