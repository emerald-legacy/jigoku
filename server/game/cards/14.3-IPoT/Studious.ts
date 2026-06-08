import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
class Studious extends DrawCard {
    static id = 'studious';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'scholar'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addKeyword('sincerity')
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Draw a card',
                when: {
                    afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext<this>) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
                },
                gameAction: AbilityDsl.actions.draw()
            })
        });
    }
}


export default Studious;
