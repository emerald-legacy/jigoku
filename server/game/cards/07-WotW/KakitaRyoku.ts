import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { CardTypes, EventNames, Players } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class KakitaRyoku extends DrawCard {
    static id = 'kakita-ryoku';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Honor a character if you have the Imperial Favor',
            when: {
                onPhaseStarted: (event: EventPayload<EventNames.OnPhaseStarted>, context: any) => event.phase !== 'setup' && context.player.imperialFavor !== ''
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default KakitaRyoku;
