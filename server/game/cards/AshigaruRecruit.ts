import { CardTypes, Locations } from '../Constants.js';
import DrawCard from '../drawcard.js';
import type Player from '../player.js';

export class AshigaruRecruit extends DrawCard {
    constructor(public facedownCard: DrawCard) {
        super(facedownCard.owner, {
            clan: 'lion',
            cost: null,
            glory: '1',
            id: 'ashigaru-recruit',
            military: '1',
            name: 'Ashigaru Recruit',
            political: '0',
            side: 'dynasty',
            text: '',
            type: CardTypes.Character,
            traits: ['peasant'],
            is_unique: false
        });
    }

    leavesPlay() {
        this.owner.moveCard(this.facedownCard, Locations.DynastyDiscardPile);
        this.game.queueSimpleStep(() => {
            this.owner.removeCardFromPile(this);
            this.game.allCards = this.game.allCards.filter((card) => card.uuid !== this.uuid);
        });
        super.leavesPlay();
    }

    getSummary(activePlayer: Player, hideWhenFaceup: boolean) {
        const summary = super.getSummary(activePlayer, hideWhenFaceup);
        const tokenProps: Record<string, unknown> = { isToken: true };
        if(activePlayer === this.controller) {
            tokenProps.facedownId = this.facedownCard.cardData.id;
            tokenProps.facedownPackId = this.facedownCard.packId;
        }
        return Object.assign(summary, tokenProps);
    }
}
