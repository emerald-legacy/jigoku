import { Location } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ToshiRanbo extends ProvinceCard {
    static id = 'toshi-ranbo';

    setupCardAbilities() {
        this.facedown = false;

        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('turnFacedown')
        });

        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card: DrawCard, context) => card.isDynasty && card.location === context?.source.location,
            effect: AbilityDsl.effects.gainExtraFateWhenPlayed()
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }

    startsGameFaceup() {
        return true;
    }
}
