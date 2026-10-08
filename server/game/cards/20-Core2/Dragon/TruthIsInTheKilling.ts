import { msg } from '../../../GameChat.js';
import { DuelType, ConflictType } from '../../../Constants.js';
import { discardFromPlay, noAction, removeFate, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { Duel } from '../../../Duel.js';

function applyFullEffect(duel: Duel) {
    return duel.winner?.some((winner) => winner.hasTrait('duelist')) ?? false;
}

export default class TruthIsInTheKilling extends DrawCard {
    static id = 'truth-is-in-the-killing';

    setupCardAbilities() {
        this.conflictAction('Initiate a military duel, discarding the loser', { conflictType: ConflictType.Military })
            .initiateDuel(() => ({
                type: DuelType.Military,
                challengerCondition: (card) => card.hasTrait('bushi') && card.isParticipating(),
                gameAction: (duel) =>
                    duel.loser ?
                        sequential(
                            duel.loser.flatMap((loser) =>
                                applyFullEffect(duel)
                                    ? [
                                        removeFate({
                                            target: loser,
                                            amount: loser.getFate(),
                                            recipient: loser.controller
                                        }),
                                        discardFromPlay({ target: loser })
                                    ]
                                    : [
                                        removeFate({
                                            target: loser,
                                            amount: loser.getFate(),
                                            recipient: loser.controller
                                        })
                                    ]
                            )
                        ) : noAction(),
                chatText: (_context, duel) => msg`return all fate on ${duel.loser} to ${duel.losingPlayer}'s fate pool${applyFullEffect(duel) ? ' and discard them' : ''}`
            }));
    }
}
