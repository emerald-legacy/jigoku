import { DuelType } from '../../../Constants.js';
import type { Duel } from '../../../Duel.js';
import { perRound } from '../../../AbilityLimit.js';
import { bow, chosenDiscard, multiple, removeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class UnyieldingTerms extends DrawCard {
    static id = 'unyielding-terms';

    setupCardAbilities() {
        this.action('Initiate a political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                requiresConflict: false,
                refuseGameAction: chosenDiscard((context) => ({
                    targets: false,
                    target: context.player.opponent,
                    amount: Math.floor((context.player.opponent?.hand.length ?? 0) / 2)
                })),
                refusalMessage: '{0} chooses to refuse the duel and discard {1} cards from their hand',
                refusalMessageArgs: (context) => [
                    context.player.opponent,
                    Math.floor((context.player.opponent?.hand.length ?? 0) / 2)
                ],
                gameAction: (duel) =>
                    multiple([
                        bow({ target: duel.loser }),
                        removeFate({ target: this.wonByDuelist(duel) ? duel.loser : undefined })
                    ]),
                message: 'bow{1} {0}',
                messageArgs: (duel) => [duel.loser, this.wonByDuelist(duel) ? ' and remove 1 fate from' : '']
            }))
            .max(perRound(1));
    }

    wonByDuelist(duel: Duel): boolean {
        return duel.winner?.some((char) => char.hasTrait('duelist')) ?? false;
    }
}
