import type { AbilityContext } from '../../AbilityContext.js';
import { CardType } from '../../Constants.js';
import { ReduceableFateCost } from '../../costs/ReduceableFateCost.js';
import type DrawCard from '../../DrawCard.js';

/** "Remove X fate from friendly characters": a fate cost that friendly characters with fate can pay. */
export class FriendlyFateCost extends ReduceableFateCost {
    isPlayCost = false;
    isPrintedFateCost = false;

    constructor(private readonly amount: (context: AbilityContext) => number) {
        super(false);
    }

    canPay(context: AbilityContext): boolean {
        const amount = this.amount(context);
        if(amount === 0) {
            return true;
        }
        let available = 0;
        for(const card of this.friendlyCharacters(context)) {
            available += card.getFate();
        }
        return available >= amount;
    }

    protected getReducedCost(context: AbilityContext): number {
        return this.amount(context);
    }

    protected getAlternateFatePools(context: AbilityContext): Set<DrawCard> {
        return this.friendlyCharacters(context);
    }

    private friendlyCharacters(context: AbilityContext): Set<DrawCard> {
        return new Set(
            context.player.cardsInPlay.filter((card: DrawCard) => card.type === CardType.Character && card.getFate() > 0)
        );
    }
}
