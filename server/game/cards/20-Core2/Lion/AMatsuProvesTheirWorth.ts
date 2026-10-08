import { msg } from '../../../GameChat.js';
import { perConflict } from '../../../AbilityLimit.js';
import { delayedEffect } from '../../../effects.js';
import { discardFromPlay, draw, gainHonor, honor, multiple, placeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { attacksAloneWithTrait } from '../../attacksAlone.js';

export default class AMatsuProvesTheirWorth extends DrawCard {
    static id = 'a-matsu-proves-their-worth';

    setupCardAbilities() {
        this.reaction('Prove yourself worthy of a Matsu name')
            .when({
                onConflictDeclared: (event, context) => attacksAloneWithTrait(event.conflict, context.player, 'bushi')
            })
            .cardLastingEffect((context) => {
                const target = context.game.requireConflict().getParticipants(
                    (participant) => participant.controller === context.player
                )[0];

                return {
                    target,
                    effect: [
                        delayedEffect({
                            when: {
                                afterConflict: (event) =>
                                    event.conflict.winner !== target.controller || !target.isParticipating()
                            },
                            gameAction: discardFromPlay(),
                            message: (context) => msg`${target} is discarded from play due to failing at ${context.source}`}),
                        delayedEffect({
                            when: {
                                afterConflict: (event) =>
                                    event.conflict.winner === target.controller && target.isParticipating()
                            },
                            gameAction: multiple([
                                honor(),
                                placeFate(),
                                gainHonor({ target: context.source.controller }),
                                draw({ target: context.source.controller })
                            ]),
                            message: (context) => msg`${target} is honored and receives 1 fate, and ${context.source.controller} gains 1 honor and draws 1 card due to ${target} succeeding at ${context.source}`})
                    ]
                };
            })
            .max(perConflict(1));
    }
}
