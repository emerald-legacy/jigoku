import { Location, Players, CardType, EntersPlayStatus } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { entersPlayWithStatus } from '../../effects.js';

export default class Tsuma extends ProvinceCard {
    static id = 'tsuma';

    override setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card, context) => card.type === CardType.Character && card.location === context?.source.location,
            effect: entersPlayWithStatus(EntersPlayStatus.Honored)
        });
    }
}
