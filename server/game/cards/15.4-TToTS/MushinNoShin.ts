import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventName, Location } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class MushinNoShin extends DrawCard {
    static id = 'mushin-no-shin';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventName.OnInitiateAbilityEffects>, context) =>
                    event.context.ability.isTriggeredAbility() &&
                    (event.cardTargets?.some(
                        (card) =>
                            (card as DrawCard).attachments.length >= 2 &&
                            card.controller === context.player &&
                            card.location === Location.PlayArea
                    ) ?? false)
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default MushinNoShin;
