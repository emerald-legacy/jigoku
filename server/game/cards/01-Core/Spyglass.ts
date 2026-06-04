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
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => (event.attackers ?? []).includes(context.source.parent as DrawCard),
                onDefendersDeclared: (event: EventPayload<EventName.OnDefendersDeclared>, context) => (event.defenders ?? []).includes(context.source.parent as DrawCard),
                onMoveToConflict: (event, context) => event.card === context.source.parent as DrawCard
            },
            gameAction: AbilityDsl.actions.draw(),
            limit: AbilityDsl.limit.perRound(2)
        });
    }
}


export default Spyglass;
