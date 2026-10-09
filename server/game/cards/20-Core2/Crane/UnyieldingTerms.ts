import { msg } from '../../../GameChat.js';
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
                refusalMessage: (_context, refuser) =>
                    msg`${refuser} chooses to refuse the duel and discard ${Math.floor(refuser.hand.length / 2)} cards from their hand`,
                gameAction: (duel) =>
                    multiple([
                        bow({ target: duel.loser }),
                        removeFate({ target: this.wonByDuelist(duel) ? duel.loser : undefined })
                    ]),
                chatText: (_context, duel) => msg`bow${this.wonByDuelist(duel) ? ' and remove 1 fate from' : ''} ${duel.loser}`
            }))
            .max(perRound(1));
    }

    wonByDuelist(duel: Duel): boolean {
        return duel.winner?.some((char) => char.hasTrait('duelist')) ?? false;
    }
}
