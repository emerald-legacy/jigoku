import { CardType, Location, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { gainExtraFateWhenPlayed } from '../../../effects.js';

export default class TheEmeraldCourt extends ProvinceCard {
    static id = 'the-emerald-court';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card, context) => card.type === CardType.Character && card.location === context?.source.location,
            effect: gainExtraFateWhenPlayed()
        });
    }
}
