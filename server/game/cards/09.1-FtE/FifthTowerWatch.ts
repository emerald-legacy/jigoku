import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Location, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class FifthTowerWatch extends DrawCard {
    static id = 'fifth-tower-watch';

    setupCardAbilities() {
        this.interrupt({
            title: 'Bow a character',
            when: {
                onCardLeavesPlay: (event: EventPayload<EventName.OnCardLeavesPlay>, context) => event.isSacrifice && event.card.controller === context.player && event.card.location === Location.PlayArea
            },
            target: {
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.getMilitarySkill() < context.event.card.getMilitarySkill(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}


export default FifthTowerWatch;
