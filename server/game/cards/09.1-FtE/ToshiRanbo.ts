import { CardType, Location, RestrictionType } from '../../Constants.js';
import type BaseCard from '../../BaseCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cardCannot, gainExtraFateWhenPlayed } from '../../effects.js';

export default class ToshiRanbo extends ProvinceCard {
    static id = 'toshi-ranbo';

    override setupCardAbilities() {
        this.facedown = false;

        this.persistentEffect({
            effect: cardCannot(RestrictionType.TurnFacedown)
        });

        // also characters played from a Back-Alley Hideaway in this province, as if from it (EmeraldDB ruling)
        this.persistentEffect({
            targetLocation: Location.Any,
            match: (card) => card.isDynasty && this.isPlayedFromHere(card),
            effect: gainExtraFateWhenPlayed()
        });
    }

    private isPlayedFromHere(card: BaseCard): boolean {
        const parent = card.parent;
        return card.location === this.location ||
            (!!parent && 'location' in parent && parent.type === CardType.Holding && parent.location === this.location);
    }

    override cannotBeStrongholdProvince() {
        return true;
    }

    override startsGameFaceup() {
        return true;
    }
}
