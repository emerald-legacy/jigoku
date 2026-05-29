import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../basecard.js';
import DrawCard from '../../drawcard.js';
import { Durations, EventNames } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ShinjoYasamura extends DrawCard {
    static id = 'shinjo-yasamura';

    setupCardAbilities() {
        this.reaction({
            title: 'Prevent a character from defending this phase',
            when: {
                onCovertResolved: (event: EventPayload<EventNames.OnCovertResolved>, context) =>
                    (event.card === context.source ||
                        (Array.isArray(event.card) && event.card.includes(context.source))) &&
                    (event.context?.target as DrawCard)?.covert
            },
            effect: 'prevent {1} from defending this phase',
            effectArgs: (context) => (context.event.context as AbilityContext).target as BaseCard,
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: (context.event.context as AbilityContext).target,
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.cardCannot('declareAsDefender')
            }))
        });
    }
}


export default ShinjoYasamura;
