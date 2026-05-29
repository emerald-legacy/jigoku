import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class EnlightenedWarrior extends DrawCard {
    static id = 'enlightened-warrior';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onConflictDeclared: (event: EventPayload<EventNames.OnConflictDeclared>, context) => (event.ringFate ?? 0) > 0 && event.conflict.attackingPlayer === context.player.opponent
            },
            gameAction: ability.actions.placeFate()
        });
    }
}


export default EnlightenedWarrior;
