import DrawCard from '../../DrawCard.js';
import { EventNames, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class KeeperInitiate extends DrawCard {
    static id = 'keeper-initiate';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Put this into play',
            when: {
                onClaimRing: (event: EventPayload<EventNames.OnClaimRing>, context) => event.player === context.player && !!context.player.role &&
                                                 (event.conflict && event.conflict.elements.some((element: any) => context.player.role?.hasTrait(element)) || context.player.role?.hasTrait(event.ring.element))
            },
            location: [Locations.Provinces, Locations.DynastyDiscardPile],
            gameAction: ability.actions.putIntoPlay(),
            then: {
                gameAction: ability.actions.placeFate()
            }
        });
    }
}


export default KeeperInitiate;
