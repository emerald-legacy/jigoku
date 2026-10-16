import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import { BaseCardSelector, type BaseCardSelectorProperties } from './BaseCardSelector.js';

export class ExactlyXCardSelector extends BaseCardSelector {
    override numCards: number;

    constructor(numCards: number, properties: BaseCardSelectorProperties) {
        super(properties);
        this.numCards = numCards;
    }

    override defaultActivePromptTitle(): string {
        if(this.cardType.length === 1) {
            return this.numCards === 1 ? 'Choose a ' + this.cardType[0] : `Choose ${this.numCards} ${this.cardType[0]}s`;
        }
        return this.numCards === 1 ? 'Select a card' : `Select ${this.numCards} cards`;
    }

    override hasEnoughSelected(selectedCards: BaseCard[]): boolean {
        return selectedCards.length === this.numCards;
    }

    override hasEnoughTargets(context: AbilityContext, choosingPlayer?: Player): boolean {
        const matchedCards: BaseCard[] = [];
        const numMatchingCards = context.game.allCards.reduce((total: number, card: BaseCard) => {
            if(this.canTarget(card, context, choosingPlayer, matchedCards)) {
                matchedCards.push(card);
                return total + 1;
            }
            return total;
        }, 0);

        return numMatchingCards >= this.numCards;
    }

    override hasReachedLimit(selectedCards: BaseCard[]): boolean {
        return selectedCards.length >= this.numCards;
    }

    override automaticFireOnSelect(): boolean {
        return this.numCards === 1;
    }
}

