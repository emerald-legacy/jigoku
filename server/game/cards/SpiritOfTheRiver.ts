import { CardType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { TokenCard } from './TokenCard.js';

class SpiritOfTheRiver extends TokenCard {
    constructor(facedownCard: DrawCard) {
        super(facedownCard, {
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
    }
}

export default SpiritOfTheRiver;
