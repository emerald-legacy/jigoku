import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { ready } from '../../GameActions/GameActions.js';

export default class MagistrateStation extends ProvinceCard {
    static id = 'magistrate-station';

    setupCardAbilities() {
        this.action('Ready an honored character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isHonored
            }, ready())
            .canTriggerOutsideConflict();
    }
}
