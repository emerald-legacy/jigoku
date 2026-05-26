import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class Spyglass extends DrawCard {
    static id = 'spyglass';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                onConflictDeclared: (event: EventPayload<EventNames.OnConflictDeclared>, context) => (event.attackers ?? []).includes(context.source.parent),
                onDefendersDeclared: (event: EventPayload<EventNames.OnDefendersDeclared>, context) => (event.defenders ?? []).includes(context.source.parent),
                onMoveToConflict: (event, context) => event.card === context.source.parent
            },
            gameAction: AbilityDsl.actions.draw(),
            limit: AbilityDsl.limit.perRound(2)
        });
    }
}


export default Spyglass;
