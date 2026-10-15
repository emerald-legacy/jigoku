import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { turnFacedown } from '../../GameActions/GameActions.js';
import { Location, CardType } from '../../Constants.js';

class SaadiyahAlMozedu extends DrawCard {
    static id = 'saadiyah-al-mozedu';

    setupCardAbilities() {
        this.action('Flip province facedown')
            .cost(costs.discardCard({
                location: Location.Hand
            }))
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => !card.isBroken && !card.isConflictProvince()
            }, turnFacedown());
    }
}

export default SaadiyahAlMozedu;
