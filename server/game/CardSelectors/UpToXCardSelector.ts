import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import { BaseCardSelector, type BaseCardSelectorProperties, type NumCardsFunc } from './BaseCardSelector.js';
import { countPromptTitle } from './countPromptTitle.js';

/** Up to X cards: a fixed number (`UpTo`), or one the context decides (`UpToVariable`). */
export class UpToXCardSelector extends BaseCardSelector {
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
        return countPromptTitle(this.cardType, this.count(context), true);
    }

    override hasReachedLimit(selectedCards: BaseCard[], context: AbilityContext): boolean {
        return selectedCards.length >= this.count(context);
    }

    override hasExceededLimit(selectedCards: BaseCard[], context: AbilityContext): boolean {
        return selectedCards.length > this.count(context);
    }

    override hasEnoughTargets(context: AbilityContext, choosingPlayer?: Player): boolean {
        return this.count(context) > 0 && super.hasEnoughTargets(context, choosingPlayer);
    }
}
