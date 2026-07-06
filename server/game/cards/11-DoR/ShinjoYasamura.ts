import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import { Duration, EventName } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ShinjoYasamura extends DrawCard {
    static id = 'shinjo-yasamura';

    setupCardAbilities() {
        this.reaction({
            title: 'Prevent a character from defending this phase',
            when: {
                onCovertResolved: (event: EventPayload<EventName.OnCovertResolved>, context) =>
                    (event.card === context.source ||
                        (Array.isArray(event.card) && event.card.includes(context.source))) &&
                    (event.context?.target as DrawCard)?.covert
            },
            effect: 'prevent {1} from defending this phase',
            effectArgs: (context) => (context.event.context as AbilityContext).target as BaseCard,
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: (context.event.context as AbilityContext).target,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.cannotBeDeclaredAsDefender()
            }))
        });
    }
}


export default ShinjoYasamura;
