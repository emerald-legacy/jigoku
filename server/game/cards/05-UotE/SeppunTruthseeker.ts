import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class SeppunTruthseeker extends DrawCard {
    static id = 'seppun-truthseeker';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.forcedInterrupt({
            title: 'Each player draws 2 cards',
            when: {
                onCardLeavesPlay: (event: EventPayload<EventNames.OnCardLeavesPlay>, context: any) => event.card === context.source
            },
            effect: 'make both players draw 2 cards',
            gameAction: ability.actions.draw((context: any) => ({
                target: context.game.getPlayers(),
                amount: 2
            }))
        });
    }
}


export default SeppunTruthseeker;
