import { DuelTypes, EventNames } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class HojatsuDevotee extends DrawCard {
    static id = 'hojatsu-devotee';

    public setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeavesPlay: (event: EventPayload<EventNames.OnCardLeavesPlay>, context) =>
                    event.card === context.source && event.context?.player === context.player.opponent
            },
            title: 'Initiate a military duel, discarding the loser',
            initiateDuel: {
                type: DuelTypes.Military,
                requiresConflict: false,
                gameAction: (duel) => AbilityDsl.actions.discardFromPlay({ target: duel.loser })
            }
        });
    }
}
