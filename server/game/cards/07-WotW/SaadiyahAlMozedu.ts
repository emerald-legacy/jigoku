import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes } from '../../Constants.js';

class SaadiyahAlMozedu extends DrawCard {
    static id = 'saadiyah-al-mozedu';

    setupCardAbilities() {
        this.action({
            title: 'Flip province facedown',
            cost: AbilityDsl.costs.discardCard({
                location: Locations.Hand
            }),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => !card.isBroken && !card.isConflictProvince(),
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }
}

export default SaadiyahAlMozedu;
