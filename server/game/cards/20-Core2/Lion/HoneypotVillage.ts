import { CardTypes, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type DrawCard from '../../../DrawCard.js';

export default class HoneypotVillage extends ProvinceCard {
    static id = 'honeypot-village';

    setupCardAbilities() {
        this.action({
            title: 'Move a character in',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card: DrawCard) => !card.bowed,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}
