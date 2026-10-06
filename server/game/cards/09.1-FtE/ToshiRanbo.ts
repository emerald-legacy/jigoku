import { Location } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cardCannot, gainExtraFateWhenPlayed } from '../../effects.js';

export default class ToshiRanbo extends ProvinceCard {
    static id = 'toshi-ranbo';

    setupCardAbilities() {
        this.facedown = false;

        this.persistentEffect({
            effect: cardCannot('turnFacedown')
        });

        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card, context) => card.isDynasty && card.location === context?.source.location,
            effect: gainExtraFateWhenPlayed()
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }

    startsGameFaceup() {
        return true;
    }
}
