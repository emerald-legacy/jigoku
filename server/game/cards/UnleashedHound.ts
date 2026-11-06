import { CardType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { TokenCard } from './TokenCard.js';

class UnleashedHound extends TokenCard {
    constructor(facedownCard: DrawCard) {
        super(facedownCard, {
            clan: 'unicorn',
            cost: null,
            glory: '0',
            id: 'unleashed-hound',
            military: '1',
            name: 'Unleashed Hound',
            political: '0',
            side: 'dynasty',
            text: '',
            type: CardType.Character,
            traits: ['creature'],
            is_unique: false
        });
    }
}

export default UnleashedHound;
