import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventNames, Locations } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class MushinNoShin extends DrawCard {
    static id = 'mushin-no-shin';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventNames.OnInitiateAbilityEffects>, context) =>
                    event.context.ability.isTriggeredAbility() &&
                    (event.cardTargets?.some(
                        (card: any) =>
                            card.attachments.length >= 2 &&
                            card.controller === context.player &&
                            card.location === Locations.PlayArea
                    ) ?? false)
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default MushinNoShin;
