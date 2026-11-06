import { CardType, Location, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { gainExtraFateWhenPlayed } from '../../../effects.js';
import { isPlayedFromProvince } from '../../playedFromProvince.js';

export default class TheEmeraldCourt extends ProvinceCard {
    static id = 'the-emerald-court';

    override setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Any,
            targetController: Players.Self,
            match: (card, context) => card.type === CardType.Character && !!context && isPlayedFromProvince(card, context.source.location),
            effect: gainExtraFateWhenPlayed()
        });
    }
}
