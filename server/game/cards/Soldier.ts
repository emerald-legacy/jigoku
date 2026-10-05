import { CardType, Location } from '../Constants.js';
import DrawCard from '../DrawCard.js';
import type Player from '../Player.js';

export default class Soldier extends DrawCard {
    facedownCard: DrawCard;

    static createDummy(owner: Player) {
        const dummyCard = new DrawCard(owner, { id: '', name: '', type: CardType.Attachment });
        return new Soldier(dummyCard);
    }

    constructor(facedownCard: DrawCard) {
        super(facedownCard.owner, {
            clan: 'neutral',
            cost: null,
            glory: null,
            id: 'soldier',
            military: null,
            military_bonus: '+1',
            political_bonus: '+1',
            name: 'Soldier',
            political: null,
            side: 'conflict',
            text: '',
            type: CardType.Attachment,
            traits: ['follower'],
            is_unique: false,
            attachment_allow_duplicates: true
        });
        this.facedownCard = facedownCard;
    }

    leavesPlay(destination = Location.ConflictDiscardPile): void {
        this.owner.moveCard(this.facedownCard, destination);
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
