import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class MagistrateStation extends ProvinceCard {
    static id = 'magistrate-station';

    setupCardAbilities() {
        this.action('Ready an honored character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isHonored
            }, AbilityDsl.actions.ready())
            .canTriggerOutsideConflict();
    }
}
