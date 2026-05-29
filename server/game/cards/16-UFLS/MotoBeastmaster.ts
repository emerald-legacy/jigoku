import DrawCard from '../../DrawCard.js';
import { CardTypes, EventNames, Locations, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class MotoBeastmaster extends DrawCard {
    static id = 'moto-beastmaster';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a character into play',
            when: {
                onConflictDeclared: (event: EventPayload<EventNames.OnConflictDeclared>, context) => event.attackers?.includes(context.source) ?? false
            },
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => context.player.firstPlayer ? card.costLessThan(5) : card.costLessThan(3),
                gameAction: AbilityDsl.actions.putIntoConflict()
            }
        });
    }
}


export default MotoBeastmaster;
