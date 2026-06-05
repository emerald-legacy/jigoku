import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { Conflict } from '../../../Conflict.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
import { EventName } from '../../../Constants.js';
export default class AMatsuProvesTheirWorth extends DrawCard {
    static id = 'a-matsu-proves-their-worth';

    setupCardAbilities() {
        this.reaction({
            title: 'Prove yourself worthy of a Matsu name',
            when: {
                onConflictDeclared: (_event, context) => {
                    const conflict = context.game.currentConflict;
                    return (
                        !!conflict &&
                        context.player === conflict.attackingPlayer &&
                        conflict.getNumberOfParticipantsFor(context.player) === 1 &&
                        conflict.getParticipants(
                            (participant) =>
                                participant.hasTrait('bushi') && participant.controller === context.player
                        ).length === 1
                    );
                }
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context: AbilityContext) => {
                const target = (context.game.currentConflict as Conflict).getParticipants(
                    (participant) => participant.controller === context.player
                )[0];

                return {
                    target,
                    effect: [
                        AbilityDsl.effects.delayedEffect({
                            when: {
                                afterConflict: (event: EventPayload<EventName.AfterConflict>) =>
                                    event.conflict.winner !== target.controller && target.isParticipating()
                            },
                            gameAction: AbilityDsl.actions.discardFromPlay(),
                            message: '{0} is discarded from play due to failing at {1}!',
                            messageArgs: (context: AbilityContext) => [target, context.source]
                        }),
                        AbilityDsl.effects.delayedEffect({
                            when: {
                                afterConflict: (event: EventPayload<EventName.AfterConflict>) =>
                                    event.conflict.winner === target.controller && target.isParticipating()
                            },
                            gameAction: AbilityDsl.actions.multiple([
                                AbilityDsl.actions.honor(),
                                AbilityDsl.actions.placeFate({ amount: 1 }),
                                AbilityDsl.actions.gainHonor({ target: context.source.controller, amount: 1 }),
                                AbilityDsl.actions.draw({ target: context.source.controller, amount: 1 })
                            ]),
                            message:
                                '{0} is honored and receives 1 fate, and {1} gains 1 honor and draw 1 card due to {0} succeeding at {2}!',
                            messageArgs: (context: AbilityContext) => [target, context.source.controller, context.source]
                        })
                    ]
                };
            }),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
