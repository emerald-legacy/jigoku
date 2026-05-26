import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, EventNames } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
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
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Draw a card',
                when: {
                    afterConflict: (event: EventPayload<EventNames.AfterConflict>, context: any) =>
                        event.conflict.winner === context.source.controller && context.source.isParticipating()
                },
                gameAction: AbilityDsl.actions.draw()
            })
        });
    }
}


export default Studious;
