import type DrawCard from '../DrawCard.js';
import { gainFate } from '../GameActions/GameActions.js';
import { LeavesPlayKeywordAbility } from './LeavesPlayKeywordAbility.js';

export class CourtesyAbility extends LeavesPlayKeywordAbility {
    constructor(card: DrawCard) {
        super(card, {
            name: 'Courtesy',
            hasKeyword: (card) => card.hasCourtesy(),
            gain: 'gains a fate',
            gameAction: (context) => gainFate({ target: context.player })
        });
    }
}
