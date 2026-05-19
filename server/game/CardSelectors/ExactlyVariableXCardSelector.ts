import BaseCardSelector from './BaseCardSelector.js';

class ExactlyVariableXCardSelector extends BaseCardSelector {
    numCardsFunc: (context: any) => number;

    constructor(numCardsFunc: (context: any) => number, properties: any) {
        super(properties);
        this.numCardsFunc = numCardsFunc;
    }

    hasExceededLimit(selectedCards: any[], context: any): boolean {
        return selectedCards.length > this.numCardsFunc(context);
    }

    defaultActivePromptTitle(context: any): string {
        if(this.cardType.length === 1) {
            return this.numCardsFunc(context) === 1 ? 'Choose a ' + this.cardType[0] : `Choose ${this.numCardsFunc(context)} ${this.cardType[0]}s`;
        }
        return this.numCardsFunc(context) === 1 ? 'Select a card' : `Select ${this.numCardsFunc(context)} cards`;
    }

    hasEnoughSelected(selectedCards: any[], context: any): boolean {
        return selectedCards.length === this.numCardsFunc(context);
    }

    hasEnoughTargets(context: any, choosingPlayer: any): boolean {
        let numMatchingCards = context.game.allCards.reduce((total: number, card: any) => {
            if(this.canTarget(card, context, choosingPlayer)) {
                return total + 1;
            }
            return total;
        }, 0);

        return numMatchingCards >= this.numCardsFunc(context);
    }

    hasReachedLimit(selectedCards: any[], context: any): boolean {
        return selectedCards.length >= this.numCardsFunc(context);
    }

    automaticFireOnSelect(context: any): boolean {
        return this.numCardsFunc(context) === 1;
    }
}

export default ExactlyVariableXCardSelector;
