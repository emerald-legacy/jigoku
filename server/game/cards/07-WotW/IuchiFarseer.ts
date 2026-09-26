import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName, Location, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class IuchiFarseer extends DrawCard {
    static id = 'iuchi-farseer';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Reveal an opponent\'s province')
            .when({
                onCharacterEntersPlay: (event: EventPayload<EventName.OnCharacterEntersPlay>, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Opponent
            }, ability.actions.reveal())
            .effect('reveal {0}');
    }
}


export default IuchiFarseer;
