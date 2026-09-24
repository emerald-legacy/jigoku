import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class Spyglass extends DrawCard {
    static id = 'spyglass';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => (event.attackers ?? []).some((card) => card === context.source.parentCharacter),
                onDefendersDeclared: (event: EventPayload<EventName.OnDefendersDeclared>, context) => (event.defenders ?? []).some((card) => card === context.source.parentCharacter),
                onMoveToConflict: (event, context) => event.card === context.source.parentCharacter
            },
            gameAction: AbilityDsl.actions.draw(),
            limit: AbilityDsl.limit.perRound(2)
        });
    }
}


export default Spyglass;
