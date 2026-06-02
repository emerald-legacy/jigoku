import AbilityDsl from '../../abilitydsl.js';
import { AbilityType, EventName } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class SturdyTetsubo extends DrawCard {
    static id = 'sturdy-tetsubo';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Reaction, {
                title: 'Make opponent discard 1 card',
                limit: AbilityDsl.limit.perRound(2),
                printedAbility: false,
                when: {
                    afterConflict: (event: EventPayload<EventName.AfterConflict>, context: any) =>
                        context.player.opponent &&
                        context.source.isParticipating() &&
                        event.conflict.winner === context.source.controller
                },
                gameAction: AbilityDsl.actions.chosenDiscard()
            })
        });
    }
}
