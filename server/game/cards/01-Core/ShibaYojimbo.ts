import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventNames, Locations } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ShibaYojimbo extends DrawCard {
    static id = 'shiba-yojimbo';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventNames.OnInitiateAbilityEffects>, context) => event.context.ability.isTriggeredAbility() && (event.cardTargets ?? []).some((card: any) => (
                    card.hasTrait('shugenja') && card.controller === context.player && card.location === Locations.PlayArea)
                )
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default ShibaYojimbo;
