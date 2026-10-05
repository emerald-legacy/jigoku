import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { claimsRoleElement } from '../claimedRings.js';

class KeeperInitiate extends DrawCard {
    static id = 'keeper-initiate';

    setupCardAbilities() {
        this.reaction('Put this into play')
            .when({
                onClaimRing: (event, context) => event.player === context.player && claimsRoleElement(context.player, event)
            })
            .gameAction(AbilityDsl.actions.putIntoPlay())
            .then(() => ({
                gameAction: AbilityDsl.actions.placeFate()
            }))
            .location([Location.Provinces, Location.DynastyDiscardPile]);
    }
}


export default KeeperInitiate;
