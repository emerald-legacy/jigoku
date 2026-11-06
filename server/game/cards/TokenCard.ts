import type { CardSummary } from '../BaseCard.js';
import { Location } from '../Constants.js';
import DrawCard from '../DrawCard.js';
import type { CardData } from '../types/CardData.js';
import type { StateViewer } from '../types/StateViewer.js';

/** A facedown card in play as a token; when the token leaves play, it is gone and the facedown card is left. */
export abstract class TokenCard extends DrawCard {
    constructor(public facedownCard: DrawCard, cardData: CardData) {
        super(facedownCard.owner, cardData);
    }

    // a token has no printed cost, which isn't a dash
    protected override getCostValue(cost: number | null): number | null {
        return cost;
    }

    /** Where the facedown card goes when the token leaves play for `destination`. */
    protected facedownDestination(_destination?: Location): Location {
        return Location.DynastyDiscardPile;
    }

    override leavesPlay(destination?: Location): void {
        this.owner.moveCard(this.facedownCard, this.facedownDestination(destination));
        this.game.queueSimpleStep(() => {
            this.owner.removeCardFromPile(this);
            this.game.allCards = this.owner.removeCardByUuid(this.game.allCards, this.uuid);
        });
        super.leavesPlay();
    }

    override getSummary(activePlayer: StateViewer, hideWhenFaceup?: boolean): CardSummary {
        const summary = super.getSummary(activePlayer, hideWhenFaceup);
        const tokenProps: Record<string, unknown> = { isToken: true };
        if(activePlayer === this.controller) {
            tokenProps.facedownId = this.facedownCard.cardData.id;
            tokenProps.facedownPackId = this.facedownCard.packId;
        }
        return Object.assign(summary, tokenProps);
    }
}
