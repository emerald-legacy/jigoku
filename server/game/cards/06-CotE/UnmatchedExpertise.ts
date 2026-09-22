import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import { EventName } from '../../Constants.js';
class UnmatchedExpertise extends DrawCard {
    static id = 'unmatched-expertise';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: ability.effects.cannotReceiveDishonorToken()
        });
        this.forcedReaction({
            title: 'Removed after attached character loses a conflict',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext<DrawCard>) => context.source.attachedCharacter && context.source.attachedCharacter.isParticipating() &&
                                                   event.conflict.loser === context.source.attachedCharacter.controller
            },
            gameAction: ability.actions.discardFromPlay()
        });
    }
}


export default UnmatchedExpertise;
