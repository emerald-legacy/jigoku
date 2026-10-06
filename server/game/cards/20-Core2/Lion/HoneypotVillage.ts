import { CardType, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { moveToConflict } from '../../../GameActions/GameActions.js';

export default class HoneypotVillage extends ProvinceCard {
    static id = 'honeypot-village';

    setupCardAbilities() {
        this.action('Move a character in')
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => !card.bowed
            }, moveToConflict());
    }
}
