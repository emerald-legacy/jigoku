import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class LicensedQuarter extends DrawCard {
    static id = 'licensed-quarter';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard the top card of your opponents conflict deck',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context) => event.conflict.winner === context.player
            },
            effect: 'discard the top card of {1}\'s conflict deck',
            effectArgs: context => [context.player.opponent as any],
            gameAction: AbilityDsl.actions.discardCard(context => ({
                target: context.player.opponent && context.player.opponent.conflictDeck[0]
            })),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}


export default LicensedQuarter;

