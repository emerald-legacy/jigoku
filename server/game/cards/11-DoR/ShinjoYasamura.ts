import DrawCard from '../../DrawCard.js';
import { Duration, EventName } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ShinjoYasamura extends DrawCard {
    static id = 'shinjo-yasamura';

    setupCardAbilities() {
        this.reaction('Prevent a character from defending this phase')
            .when({
                onCovertResolved: (event: EventPayload<EventName.OnCovertResolved>, context) =>
                    (event.card === context.source ||
                        (Array.isArray(event.card) && event.card.includes(context.source))) &&
                    (event.context?.target as DrawCard)?.covert
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.event.context.target,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.cannotBeDeclaredAsDefender()
            })))
            .effect('prevent {1} from defending this phase', (context) => context.event.context.target);
    }
}


export default ShinjoYasamura;
