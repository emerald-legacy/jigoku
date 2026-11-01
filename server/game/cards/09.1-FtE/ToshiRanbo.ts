import { Location, RestrictionType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cardCannot, gainExtraFateWhenPlayed } from '../../effects.js';
import { isPlayedFromProvince } from '../playedFromProvince.js';

export default class ToshiRanbo extends ProvinceCard {
    static id = 'toshi-ranbo';

    override setupCardAbilities() {
        this.facedown = false;

        this.persistentEffect({
            effect: cardCannot(RestrictionType.TurnFacedown)
        });

        this.persistentEffect({
            targetLocation: Location.Any,
            match: (card) => card.isDynasty && isPlayedFromProvince(card, this.location),
            effect: gainExtraFateWhenPlayed()
        });
    }

    override cannotBeStrongholdProvince() {
        return true;
    }

    override startsGameFaceup() {
        return true;
    }
}
