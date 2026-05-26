import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { CardTypes, EventNames, Locations, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class IuchiFarseer extends DrawCard {
    static id = 'iuchi-farseer';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Reveal an opponent\'s province',
            when: {
                onCharacterEntersPlay: (event: EventPayload<EventNames.OnCharacterEntersPlay>, context: any) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Opponent,
                gameAction: ability.actions.reveal()
            },
            effect: 'reveal {0}'
        });
    }
}


export default IuchiFarseer;
