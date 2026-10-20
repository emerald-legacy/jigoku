import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { claimsRoleElement } from '../claimedRings.js';

class KeeperInitiate extends DrawCard {
    static id = 'keeper-initiate';

    override setupCardAbilities() {
        this.reaction('Put this into play')
            .when({
                onClaimRing: (event, context) => event.player === context.player && claimsRoleElement(context.player, event)
            })
            .location([Location.Provinces, Location.DynastyDiscardPile])
            .putIntoPlay()
            .then()
            .placeFate();
    }
}


export default KeeperInitiate;
