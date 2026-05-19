import { Locations, Players, CardTypes, CharacterStatus } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class Tsuma extends ProvinceCard {
    static id = 'tsuma';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            targetController: Players.Self,
            match: (card, context) => card.type === CardTypes.Character && card.location === context.source.location,
            effect: AbilityDsl.effects.entersPlayWithStatus(CharacterStatus.Honored)
        });
    }
}
