import { Location, Players, CardType, CharacterStatus } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class Tsuma extends ProvinceCard {
    static id = 'tsuma';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card: DrawCard, context) => card.type === CardType.Character && card.location === context?.source.location,
            effect: AbilityDsl.effects.entersPlayWithStatus(CharacterStatus.Honored)
        });
    }
}
