import DrawCard from '../../DrawCard.js';
import { CardTypes, EventNames } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class FallenInBattle extends DrawCard {
    static id = 'fallen-in-battle';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Discard a character',
            when: {
                afterConflict: (event: EventPayload<EventNames.AfterConflict>, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'military' &&
                                                   (event.conflict.skillDifference ?? 0) >= 5
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            },
            max: ability.limit.perConflict(1)
        });
    }
}


export default FallenInBattle;
