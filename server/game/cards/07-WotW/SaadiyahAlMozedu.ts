import DrawCard from '../../DrawCard.js';
import BaseCard from '../../BaseCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType } from '../../Constants.js';

class SaadiyahAlMozedu extends DrawCard {
    static id = 'saadiyah-al-mozedu';

    setupCardAbilities() {
        this.action({
            title: 'Flip province facedown',
            cost: AbilityDsl.costs.discardCard({
                location: Location.Hand
            }),
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card: BaseCard) => !(card as ProvinceCard).isBroken && !(card as ProvinceCard).isConflictProvince(),
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }
}

export default SaadiyahAlMozedu;
