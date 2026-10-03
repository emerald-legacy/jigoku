import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class SeppunTruthseeker extends DrawCard {
    static id = 'seppun-truthseeker';

    setupCardAbilities() {
        this.forcedInterrupt('Each player draws 2 cards')
            .when({
                onCardLeavesPlay: (event: EventPayload<EventName.OnCardLeavesPlay>, context) => event.card === context.source
            })
            .gameAction(AbilityDsl.actions.draw((context) => ({
                target: context.game.getPlayers(),
                amount: 2
            })))
            .effect('make both players draw 2 cards');
    }
}


export default SeppunTruthseeker;
