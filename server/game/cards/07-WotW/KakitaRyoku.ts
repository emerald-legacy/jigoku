import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class KakitaRyoku extends DrawCard {
    static id = 'kakita-ryoku';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Honor a character if you have the Imperial Favor',
            when: {
                onPhaseStarted: (event: EventPayload<EventName.OnPhaseStarted>, context) => event.phase !== 'setup' && context.player.imperialFavor !== ''
            },
            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default KakitaRyoku;
