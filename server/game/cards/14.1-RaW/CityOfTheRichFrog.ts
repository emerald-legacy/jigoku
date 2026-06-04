import { EventName, Phases, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { AbilityContext } from '../../AbilityContext.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
export default class CityOfTheRichFrog extends ProvinceCard {
    static id = 'city-of-the-rich-frog';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.currentPhase !== 'setup',
            effect: AbilityDsl.effects.refillProvinceTo(3)
        });

        this.persistentEffect({
            targetController: Players.Self,
            effect: AbilityDsl.effects.playerDelayedEffect({
                when: {
                    onPhaseEnded: (event: EventPayload<EventName.OnPhaseEnded>) => event.phase === Phases.Setup
                },
                message: '{0} fills to 3 cards!',
                messageArgs: (effectContext: AbilityContext) => [effectContext.source],
                gameAction: AbilityDsl.actions.fillProvince((context) => ({
                    location: context.source.location,
                    fillTo: 3
                }))
            })
        });
    }
}
