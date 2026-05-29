import DrawCard from '../../DrawCard.js';
import { CardTypes, EventNames, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ShinjoAltansarnai extends DrawCard {
    static id = 'shinjo-altansarnai';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Discard a character',
            when: {
                onBreakProvince: (event: EventPayload<EventNames.OnBreakProvince>, context) => event.conflict?.conflictType === 'military' && context.source.isAttacking()
            },
            target: {
                activePromptTitle: 'Choose a character to discard',
                cardType: CardTypes.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}


export default ShinjoAltansarnai;
