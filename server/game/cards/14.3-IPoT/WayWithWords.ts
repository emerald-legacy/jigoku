import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
class WayWithWords extends DrawCard {
    static id = 'way-with-words';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Take 1 honor',
                when: {
                    afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext) =>
                        (context.source as DrawCard).isParticipating() &&
                        event.conflict.winner === context.source.controller &&
                        context.player.opponent &&
                        event.conflict.conflictType === 'political'
                },
                gameAction: AbilityDsl.actions.takeHonor()
            })
        });
    }
}


export default WayWithWords;
