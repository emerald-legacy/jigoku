import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class AudienceChamber extends DrawCard {
    static id = 'audience-chamber';

    setupCardAbilities() {
        this.reaction({
            title: 'Place fate on character',
            when: {
                onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>, context) =>
                    event.player === context.player &&
                    event.card.type === CardType.Character &&
                    (event.card.getCost() ?? 0) >= 4
            },
            gameAction: AbilityDsl.actions.placeFate((context) => ({
                target: context.event.card
            }))
        });
    }
}


export default AudienceChamber;
