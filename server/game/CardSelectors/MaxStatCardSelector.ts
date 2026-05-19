import BaseCardSelector from './BaseCardSelector.js';

class MaxStatCardSelector extends BaseCardSelector {
    cardStat: (card: any) => number;
    maxStat: () => number;
    numCards: number;

    constructor(properties: any) {
        super(properties);
        this.cardStat = properties.cardStat;
        this.maxStat = properties.maxStat;
        this.numCards = properties.numCards;
    }

    canTarget(card: any, context: any, choosingPlayer: any, selectedCards: any[] = []): boolean {
        return super.canTarget(card, context, choosingPlayer, selectedCards) && this.cardStat(card) <= this.maxStat();
    }

    wouldExceedLimit(selectedCards: any[], card: any): boolean {
        let currentStatSum = selectedCards.reduce((sum: number, c: any) => sum + this.cardStat(c), 0);
        return this.cardStat(card) + currentStatSum > this.maxStat();
    }

    hasReachedLimit(selectedCards: any[]): boolean {
        return this.numCards > 0 && selectedCards.length >= this.numCards;
    }

    hasExceededLimit(selectedCards: any[]): boolean {
        let currentStatSum = selectedCards.reduce((sum: number, c: any) => sum + this.cardStat(c), 0);
        return currentStatSum > this.maxStat() || (this.numCards > 0 && selectedCards.length > this.numCards);
    }
}

export default MaxStatCardSelector;
