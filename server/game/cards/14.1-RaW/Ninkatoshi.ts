import { Location, Players, CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';

export default class Ninkatoshi extends ProvinceCard {
    static id = 'ninkatoshi';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,

            match: (card, context) =>
                !!context && card.type === CardType.Province && card !== context.source && card.controller === context.player,
            effect: modifyProvinceStrength(1)
        });
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Opponent,

            match: (card, context) => !!context && card.type === CardType.Province && card.controller === context.player.opponent,
            effect: modifyProvinceStrength(-1)
        });
    }
}
