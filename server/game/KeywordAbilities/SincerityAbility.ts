import type DrawCard from '../DrawCard.js';
import { draw } from '../GameActions/GameActions.js';
import { LeavesPlayKeywordAbility } from './LeavesPlayKeywordAbility.js';

export class SincerityAbility extends LeavesPlayKeywordAbility {
    constructor(card: DrawCard) {
        super(card, {
            name: 'Sincerity',
            hasKeyword: (card) => card.hasSincerity(),
            gain: 'draws a card',
            gameAction: (context) => draw({ target: context.player })
        });
    }
}
