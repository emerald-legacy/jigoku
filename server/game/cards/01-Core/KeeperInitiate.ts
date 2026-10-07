import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { putIntoPlay } from '../../GameActions/GameActions.js';
import { claimsRoleElement } from '../claimedRings.js';

class KeeperInitiate extends DrawCard {
    static id = 'keeper-initiate';

    setupCardAbilities() {
        this.reaction('Put this into play')
            .when({
                onClaimRing: (event, context) => event.player === context.player && claimsRoleElement(context.player, event)
            })
            .location([Location.Provinces, Location.DynastyDiscardPile])
            .gameAction(putIntoPlay())
            .then()
            .placeFate();
    }
}


export default KeeperInitiate;
