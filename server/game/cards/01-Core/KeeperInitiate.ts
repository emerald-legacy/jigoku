import DrawCard from '../../DrawCard.js';
import { EventName, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class KeeperInitiate extends DrawCard {
    static id = 'keeper-initiate';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Put this into play')
            .when({
                onClaimRing: (event: EventPayload<EventName.OnClaimRing>, context) => event.player === context.player && !!context.player.role &&
                                                 (event.conflict && event.conflict.elements.some(element => context.player.role?.hasTrait(element)) || context.player.role?.hasTrait(event.ring.element))
            })
            .gameAction(ability.actions.putIntoPlay())
            .then(() => ({
                gameAction: ability.actions.placeFate()
            }))
            .location([Location.Provinces, Location.DynastyDiscardPile]);
    }
}


export default KeeperInitiate;
