import BaseCardSelector from './BaseCardSelector.js';

class UpToVariableXCardSelector extends BaseCardSelector {
    numCardsFunc: (context: any) => number;

    constructor(numCardsFunc: (context: any) => number, properties: any) {
        super(properties);
        this.numCardsFunc = numCardsFunc;
    }

    defaultActivePromptTitle(context: any): string {
        if(this.cardType.length === 1) {
            return this.numCardsFunc(context) === 1 ? 'Select a ' + this.cardType[0] : `Select up to ${this.numCardsFunc(context)} ${this.cardType[0]}s`;
        }
        return this.numCardsFunc(context) === 1 ? 'Select a card' : `Select up to ${this.numCardsFunc(context)} cards`;
    }

    hasReachedLimit(selectedCards: any[], context: any): boolean {
        return selectedCards.length >= this.numCardsFunc(context);
    }

    hasExceededLimit(selectedCards: any[], context: any): boolean {
        return selectedCards.length > this.numCardsFunc(context);
    }

    hasEnoughTargets(context: any, choosingPlayer: any): boolean {
        return this.numCardsFunc(context) > 0 && super.hasEnoughTargets(context, choosingPlayer);
    }
}

export default UpToVariableXCardSelector;
