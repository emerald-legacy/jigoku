import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KeeperInitiate extends DrawCard {
    static id = 'keeper-initiate';

    setupCardAbilities() {
        this.reaction('Put this into play')
            .when({
                onClaimRing: (event, context) => event.player === context.player && !!context.player.role &&
                                                 (event.conflict && event.conflict.elements.some(element => context.player.role?.hasTrait(element)) || context.player.role.hasTrait(event.ring.element))
            })
            .gameAction(AbilityDsl.actions.putIntoPlay())
            .then(() => ({
                gameAction: AbilityDsl.actions.placeFate()
            }))
            .location([Location.Provinces, Location.DynastyDiscardPile]);
    }
}


export default KeeperInitiate;
