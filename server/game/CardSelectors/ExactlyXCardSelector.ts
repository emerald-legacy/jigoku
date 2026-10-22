import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import { BaseCardSelector, type BaseCardSelectorProperties, type NumCardsFunc } from './BaseCardSelector.js';
import { countPromptTitle } from './countPromptTitle.js';

/** Exactly X cards: a fixed number (`Exactly`), or one the context decides (`ExactlyVariable`). */
export class ExactlyXCardSelector extends BaseCardSelector {
    count: NumCardsFunc;

    constructor(numCards: number | NumCardsFunc, properties: BaseCardSelectorProperties) {
        super(properties);
        if(typeof numCards === 'number') {
            this.numCards = numCards;
            this.count = () => numCards;
        } else {
            this.count = numCards;
        }
    }

    override defaultActivePromptTitle(context: AbilityContext): string {
        return countPromptTitle(this.cardType, this.count(context), false);
    }

    override hasEnoughSelected(selectedCards: BaseCard[], context: AbilityContext): boolean {
        return selectedCards.length === this.count(context);
    }

    override hasEnoughTargets(context: AbilityContext, choosingPlayer?: Player): boolean {
        const matchedCards: BaseCard[] = [];
        for(const card of context.game.allCards) {
            if(this.canTarget(card, context, choosingPlayer, matchedCards)) {
                matchedCards.push(card);
            }
        }
        return matchedCards.length >= this.count(context);
    }

    override hasReachedLimit(selectedCards: BaseCard[], context: AbilityContext): boolean {
        return selectedCards.length >= this.count(context);
    }

    override hasExceededLimit(selectedCards: BaseCard[], context: AbilityContext): boolean {
        return selectedCards.length > this.count(context);
    }

    override automaticFireOnSelect(context: AbilityContext): boolean {
        return this.count(context) === 1;
    }
}
