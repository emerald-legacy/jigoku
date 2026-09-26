import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class LicensedQuarter extends DrawCard {
    static id = 'licensed-quarter';

    setupCardAbilities() {
        this.reaction('Discard the top card of your opponents conflict deck')
            .when({
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context) => event.conflict.winner === context.player
            })
            .gameAction(AbilityDsl.actions.discardCard(context => ({
                target: context.player.opponent && context.player.opponent.conflictDeck[0]
            })))
            .effect('discard the top card of {1}\'s conflict deck', context => [context.player.opponent])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default LicensedQuarter;

