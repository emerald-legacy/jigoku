import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, EventNames } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class WayWithWords extends DrawCard {
    static id = 'way-with-words';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Take 1 honor',
                when: {
                    afterConflict: (event: EventPayload<EventNames.AfterConflict>, context: any) =>
                        context.source.isParticipating() &&
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
