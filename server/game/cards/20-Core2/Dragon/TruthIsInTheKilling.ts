import { DuelType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { Duel } from '../../../Duel.js';

function applyFullEffect(duel: Duel) {
    return duel.winner?.some((winner) => winner.hasTrait('duelist')) ?? false;
}

export default class TruthIsInTheKilling extends DrawCard {
    static id = 'truth-is-in-the-killing';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel, discarding the loser',
            condition: (context) => context.game.isDuringConflict('military'),
            initiateDuel: {
                type: DuelType.Military,
                challengerCondition: (card) => card.hasTrait('bushi') && card.isParticipating(),
                gameAction: ((duel: Duel) =>
                    (duel.loser ?
                        AbilityDsl.actions.sequential(
                            duel.loser.flatMap((loser) =>
                                applyFullEffect(duel)
                                    ? [
                                        AbilityDsl.actions.removeFate({
                                            target: loser,
                                            amount: loser.getFate(),
                                            recipient: loser.controller
                                        }),
                                        AbilityDsl.actions.discardFromPlay({ target: loser })
                                    ]
                                    : [
                                        AbilityDsl.actions.removeFate({
                                            target: loser,
                                            amount: loser.getFate(),
                                            recipient: loser.controller
                                        })
                                    ]
                            )
                        ) : AbilityDsl.actions.noAction())) as any,
                message: 'return all fate on {0} to {1}\'s fate pool{2}',
                messageArgs: (duel) => [duel.loser, duel.losingPlayer, applyFullEffect(duel) ? ' and discard them' : '']
            }
        });
    }
}
