import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import BaseCardSelector, { type BaseCardSelectorProperties, type NumCardsFunc } from './BaseCardSelector.js';

class ExactlyVariableXCardSelector extends BaseCardSelector {
    numCardsFunc: NumCardsFunc;

    constructor(numCardsFunc: NumCardsFunc, properties: BaseCardSelectorProperties) {
        super(properties);
        this.numCardsFunc = numCardsFunc;
    }

    hasExceededLimit(selectedCards: BaseCard[], context: AbilityContext): boolean {
        return selectedCards.length > this.numCardsFunc(context);
    }

    defaultActivePromptTitle(context: AbilityContext): string {
        if(this.cardType.length === 1) {
            return this.numCardsFunc(context) === 1 ? 'Choose a ' + this.cardType[0] : `Choose ${this.numCardsFunc(context)} ${this.cardType[0]}s`;
        }
        return this.numCardsFunc(context) === 1 ? 'Select a card' : `Select ${this.numCardsFunc(context)} cards`;
    }

    hasEnoughSelected(selectedCards: BaseCard[], context: AbilityContext): boolean {
        return selectedCards.length === this.numCardsFunc(context);
    }

    hasEnoughTargets(context: AbilityContext, choosingPlayer: Player): boolean {
        let numMatchingCards = context.game.allCards.reduce((total: number, card: BaseCard) => {
            if(this.canTarget(card, context, choosingPlayer)) {
                return total + 1;
            }
            return total;
        }, 0);

        return numMatchingCards >= this.numCardsFunc(context);
    }

    hasReachedLimit(selectedCards: BaseCard[], context: AbilityContext): boolean {
        return selectedCards.length >= this.numCardsFunc(context);
    }

    automaticFireOnSelect(context: AbilityContext): boolean {
        return this.numCardsFunc(context) === 1;
    }
}

export default ExactlyVariableXCardSelector;
