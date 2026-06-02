import DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { Location, CardType } from '../Constants.js';

class SpiritOfTheRiver extends DrawCard {
    facedownCard: DrawCard;

    constructor(facedownCard: DrawCard) {
        super(facedownCard.owner, {
            clan: 'neutral',
            cost: null,
            glory: '0',
            id: 'spirit-of-the-river',
            military: '1',
            name: 'Spirit of the River',
            political: null,
            side: 'dynasty',
            text: '',
            type: CardType.Character,
            traits: ['spirit', 'cavalry'],
            is_unique: false
        });
        this.facedownCard = facedownCard;
    }

    leavesPlay() {
        this.owner.moveCard(this.facedownCard, Location.DynastyDiscardPile);
        this.game.queueSimpleStep(() => {
            this.owner.removeCardFromPile(this);
            this.game.allCards = this.owner.removeCardByUuid(this.game.allCards, this.uuid);
        });
        super.leavesPlay();
    }

    getSummary(activePlayer: Player, hideWhenFaceup?: boolean) {
        const summary = super.getSummary(activePlayer, hideWhenFaceup);
        const tokenProps: Record<string, unknown> = { isToken: true };
        if(activePlayer === this.controller) {
            tokenProps.facedownId = this.facedownCard.cardData.id;
            tokenProps.facedownPackId = this.facedownCard.packId;
        }
        return Object.assign(summary, tokenProps);
    }
}

export default SpiritOfTheRiver;
