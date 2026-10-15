import { msg } from '../../../GameChat.js';
import { DuelType, ConflictType, Trait } from '../../../Constants.js';
import { discardFromPlay, noAction, removeFate, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { ResolvedDuel } from '../../../Duel.js';

function applyFullEffect(duel: ResolvedDuel) {
    return duel.winner.some((winner) => winner.hasTrait(Trait.Duelist));
}

export default class TruthIsInTheKilling extends DrawCard {
    static id = 'truth-is-in-the-killing';

    setupCardAbilities() {
        this.conflictAction('Initiate a military duel, discarding the loser', { conflictType: ConflictType.Military })
            .initiateDuel(() => ({
                type: DuelType.Military,
                challengerCondition: (card) => card.hasTrait(Trait.Bushi) && card.isParticipating(),
                gameAction: (duel) =>
                    duel.loser ?
                        sequential(
                            duel.loser.flatMap((loser) =>
                                applyFullEffect(duel)
                                    ? [
                                        removeFate({
                                            target: loser,
                                            amount: loser.getFate(),
                                            recipient: loser.owner
                                        }),
                                        discardFromPlay({ target: loser })
                                    ]
                                    : [
                                        removeFate({
                                            target: loser,
                                            amount: loser.getFate(),
                                            recipient: loser.owner
                                        })
                                    ]
                            )
                        ) : noAction(),
                chatText: (_context, duel) => msg`return all fate on ${duel.loser} to ${duel.loser?.[0]?.owner}'s fate pool${applyFullEffect(duel) ? ' and discard them' : ''}`
            }));
    }
}
