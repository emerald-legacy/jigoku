import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import BaseCardSelector, { type BaseCardSelectorProperties } from './BaseCardSelector.js';

export interface MaxStatCardSelectorProperties extends BaseCardSelectorProperties {
    cardStat: (card: BaseCard) => number;
    maxStat: () => number;
    numCards: number;
}

class MaxStatCardSelector extends BaseCardSelector {
    cardStat: (card: BaseCard) => number;
    maxStat: () => number;
    numCards: number;

    constructor(properties: MaxStatCardSelectorProperties) {
        super(properties);
        this.cardStat = properties.cardStat;
        this.maxStat = properties.maxStat;
        this.numCards = properties.numCards;
    }

    canTarget(card: BaseCard, context: AbilityContext, choosingPlayer?: Player, selectedCards: BaseCard[] = []): boolean {
        return super.canTarget(card, context, choosingPlayer, selectedCards) && this.cardStat(card) <= this.maxStat();
    }

    wouldExceedLimit(selectedCards: BaseCard[], card: BaseCard): boolean {
        let currentStatSum = selectedCards.reduce((sum: number, c: BaseCard) => sum + this.cardStat(c), 0);
        return this.cardStat(card) + currentStatSum > this.maxStat();
    }

    hasReachedLimit(selectedCards: BaseCard[]): boolean {
        return this.numCards > 0 && selectedCards.length >= this.numCards;
    }

    hasExceededLimit(selectedCards: BaseCard[]): boolean {
        let currentStatSum = selectedCards.reduce((sum: number, c: BaseCard) => sum + this.cardStat(c), 0);
        return currentStatSum > this.maxStat() || (this.numCards > 0 && selectedCards.length > this.numCards);
    }
}

export default MaxStatCardSelector;
