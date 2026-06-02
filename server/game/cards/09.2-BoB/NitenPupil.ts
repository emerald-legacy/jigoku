import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class NitenPupil extends DrawCard {
    static id = 'niten-pupil';

    setupCardAbilities() {
        this.reaction({
            title: 'Double base skills',
            when: {
                onHonorDialsRevealed: (event: EventPayload<EventName.OnHonorDialsRevealed>, context) => event.duel && event.duel.isInvolved(context.source)
            },
            gameAction: AbilityDsl.actions.cardLastingEffect({
                effect: [
                    AbilityDsl.effects.modifyBaseMilitarySkillMultiplier(2),
                    AbilityDsl.effects.modifyBasePoliticalSkillMultiplier(2)
                ],
                duration: Duration.UntilEndOfPhase
            }),
            effect: 'double {0}\'s base {1} and {2} skills',
            effectArgs: ['military', 'political']
        });
    }
}


export default NitenPupil;
