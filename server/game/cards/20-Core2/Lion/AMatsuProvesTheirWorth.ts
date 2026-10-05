import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { attacksAloneWithTrait } from '../../attacksAlone.js';

export default class AMatsuProvesTheirWorth extends DrawCard {
    static id = 'a-matsu-proves-their-worth';

    setupCardAbilities() {
        this.reaction('Prove yourself worthy of a Matsu name')
            .when({
                onConflictDeclared: (event, context) => attacksAloneWithTrait(event.conflict, context.player, 'bushi')
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => {
                const target = context.game.requireConflict().getParticipants(
                    (participant) => participant.controller === context.player
                )[0];

                return {
                    target,
                    effect: [
                        AbilityDsl.effects.delayedEffect({
                            when: {
                                afterConflict: (event) =>
                                    event.conflict.winner !== target.controller && target.isParticipating()
                            },
                            gameAction: AbilityDsl.actions.discardFromPlay(),
                            message: '{0} is discarded from play due to failing at {1}',
                            messageArgs: (context) => [target, context.source]
                        }),
                        AbilityDsl.effects.delayedEffect({
                            when: {
                                afterConflict: (event) =>
                                    event.conflict.winner === target.controller && target.isParticipating()
                            },
                            gameAction: AbilityDsl.actions.multiple([
                                AbilityDsl.actions.honor(),
                                AbilityDsl.actions.placeFate({ amount: 1 }),
                                AbilityDsl.actions.gainHonor({ target: context.source.controller, amount: 1 }),
                                AbilityDsl.actions.draw({ target: context.source.controller, amount: 1 })
                            ]),
                            message:
                                '{0} is honored and receives 1 fate, and {1} gains 1 honor and draws 1 card due to {0} succeeding at {2}',
                            messageArgs: (context) => [target, context.source.controller, context.source]
                        })
                    ]
                };
            }))
            .max(AbilityDsl.limit.perConflict(1));
    }
}
