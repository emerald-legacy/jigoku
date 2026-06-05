import { Location, Players, CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type BaseCard from '../../BaseCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class Ninkatoshi extends ProvinceCard {
    static id = 'ninkatoshi';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            condition: () => true,
            match: (card, context) =>
                !!context && card.type === CardType.Province && card !== (context.source as BaseCard) && card.controller === context.player,
            effect: AbilityDsl.effects.modifyProvinceStrength(1)
        });
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Opponent,
            condition: () => true,
            match: (card, context) => !!context && card.type === CardType.Province && card.controller === context.player.opponent,
            effect: AbilityDsl.effects.modifyProvinceStrength(-1)
        });
    }
}
