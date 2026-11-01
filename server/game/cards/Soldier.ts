import { CardType, Location } from '../Constants.js';
import DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { TokenCard } from './TokenCard.js';

export default class Soldier extends TokenCard {
    static createDummy(owner: Player) {
        const dummyCard = new DrawCard(owner, { id: '', name: '', type: CardType.Attachment });
        return new Soldier(dummyCard);
    }

    constructor(facedownCard: DrawCard) {
        super(facedownCard, {
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
    }

    protected override facedownDestination(destination: Location = Location.ConflictDiscardPile): Location {
        return destination;
    }
}
