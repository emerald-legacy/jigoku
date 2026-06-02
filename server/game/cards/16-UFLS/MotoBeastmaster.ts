import DrawCard from '../../DrawCard.js';
import { CardType, EventName, Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class MotoBeastmaster extends DrawCard {
    static id = 'moto-beastmaster';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a character into play',
            when: {
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => event.attackers?.includes(context.source) ?? false
            },
            target: {
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => context.player.firstPlayer ? card.costLessThan(5) : card.costLessThan(3),
                gameAction: AbilityDsl.actions.putIntoConflict()
            }
        });
    }
}


export default MotoBeastmaster;
