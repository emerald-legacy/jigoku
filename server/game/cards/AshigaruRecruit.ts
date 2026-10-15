import { CardType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import { TokenCard } from './TokenCard.js';

export class AshigaruRecruit extends TokenCard {
    constructor(facedownCard: DrawCard) {
        super(facedownCard, {
            clan: 'lion',
            cost: null,
            glory: '1',
            id: 'ashigaru-recruit',
            military: '1',
            name: 'Ashigaru Recruit',
            political: '0',
            side: 'dynasty',
            text: '',
            type: CardType.Character,
            traits: ['peasant'],
            is_unique: false
        });
    }
}
