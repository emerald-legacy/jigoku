import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, EventNames } from '../../Constants.js';
import DrawCard from '../../drawcard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class SturdyTetsubo extends DrawCard {
    static id = 'sturdy-tetsubo';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Make opponent discard 1 card',
                limit: AbilityDsl.limit.perRound(2),
                printedAbility: false,
                when: {
                    afterConflict: (event: EventPayload<EventNames.AfterConflict>, context: any) =>
                        context.player.opponent &&
                        context.source.isParticipating() &&
                        event.conflict.winner === context.source.controller
                },
                gameAction: AbilityDsl.actions.chosenDiscard()
            })
        });
    }
}
