import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class UnmatchedExpertise extends DrawCard {
    static id = 'unmatched-expertise';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: ability.effects.cardCannot('receiveDishonorToken')
        });
        this.forcedReaction({
            title: 'Removed after attached character loses a conflict',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context: any) => context.source.parent && context.source.parent.isParticipating() &&
                                                   event.conflict.loser === context.source.parent.controller
            },
            gameAction: ability.actions.discardFromPlay()
        });
    }
}


export default UnmatchedExpertise;
