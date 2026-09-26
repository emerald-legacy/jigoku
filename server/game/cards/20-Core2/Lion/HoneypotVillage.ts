import { CardType, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class HoneypotVillage extends ProvinceCard {
    static id = 'honeypot-village';

    setupCardAbilities() {
        this.action('Move a character in')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.bowed
            }, AbilityDsl.actions.moveToConflict());
    }
}
