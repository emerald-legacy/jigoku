import { Location, RestrictionType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cardCannot, gainExtraFateWhenPlayed } from '../../effects.js';

export default class ToshiRanbo extends ProvinceCard {
    static id = 'toshi-ranbo';

    override setupCardAbilities() {
        this.facedown = false;

        this.persistentEffect({
            effect: cardCannot(RestrictionType.TurnFacedown)
        });

        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card, context) => card.isDynasty && card.location === context?.source.location,
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
