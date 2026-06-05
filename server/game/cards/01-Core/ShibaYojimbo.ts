import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventName, Location } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ShibaYojimbo extends DrawCard {
    static id = 'shiba-yojimbo';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventName.OnInitiateAbilityEffects>, context) => event.context.ability.isTriggeredAbility() && (event.cardTargets ?? []).some(card => (
                    card.hasTrait('shugenja') && card.controller === context.player && card.location === Location.PlayArea)
                )
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default ShibaYojimbo;
