import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import BaseCardSelector, { type BaseCardSelectorProperties } from './BaseCardSelector.js';

class ExactlyXCardSelector extends BaseCardSelector {
    numCards: number;

    constructor(numCards: number, properties: BaseCardSelectorProperties) {
        super(properties);
        this.numCards = numCards;
    }

    defaultActivePromptTitle(): string {
        if(this.cardType.length === 1) {
            return this.numCards === 1 ? 'Choose a ' + this.cardType[0] : `Choose ${this.numCards} ${this.cardType[0]}`;
        }
        return this.numCards === 1 ? 'Select a card' : `Select ${this.numCards} cards`;
    }

    hasEnoughSelected(selectedCards: BaseCard[]): boolean {
        return selectedCards.length === this.numCards;
    }

    hasEnoughTargets(context: AbilityContext, choosingPlayer: Player): boolean {
        let matchedCards: BaseCard[] = [];
        let numMatchingCards = context.game.allCards.reduce((total: number, card: BaseCard) => {
            if(this.canTarget(card, context, choosingPlayer, matchedCards)) {
                matchedCards.push(card);
                return total + 1;
            }
            return total;
        }, 0);

        return numMatchingCards >= this.numCards;
    }

    hasReachedLimit(selectedCards: BaseCard[]): boolean {
        return selectedCards.length >= this.numCards;
    }

    automaticFireOnSelect(): boolean {
        return this.numCards === 1;
    }
}

export default ExactlyXCardSelector;
