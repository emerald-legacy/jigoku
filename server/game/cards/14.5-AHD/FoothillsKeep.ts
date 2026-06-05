import { CardType, Location, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type BaseCard from '../../BaseCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class FoothillsKeep extends ProvinceCard {
    static id = 'foothills-keep';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            condition: () => true,
            match: (card, context) =>
                card.type === CardType.Province && card !== (context?.source as BaseCard) && card.controller === context?.player,
            effect: AbilityDsl.effects.fateCostToRingToDeclareConflictAgainst()
        });
    }
}
