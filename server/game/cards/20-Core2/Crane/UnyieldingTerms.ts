import { msg } from '../../../GameChat.js';
import { DuelType, Trait } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { ResolvedDuel } from '../../../Duel.js';
import { perRound } from '../../../AbilityLimit.js';
import { bow, chosenDiscard, multiple, removeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class UnyieldingTerms extends DrawCard {
    static id = 'unyielding-terms';

    override setupCardAbilities() {
        this.action('Initiate a political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                requiresConflict: false,
                refuseGameAction: chosenDiscard((context) => ({
                    targets: false,
                    target: context.player.opponent,
                    amount: Math.floor((context.player.opponent?.hand.length ?? 0) / 2)
                })),
                refusalMessage: (_context, refuser) => {
                    const amount = Math.floor(refuser.hand.length / 2);
                    return msg`${refuser} chooses to refuse the duel and discard ${amount} card${amount === 1 ? '' : 's'} from their hand`;
                },
                gameAction: (duel) =>
                    multiple([
                        bow({ target: duel.loser }),
                        removeFate({ target: this.wonByDuelist(duel) ? duel.loser : undefined })
                    ]),
                chatText: (context, duel) => this.duelEffectMessage(context, duel)
            }))
            .max(perRound(1));
    }

    private duelEffectMessage(context: AbilityContext, duel: ResolvedDuel) {
        const losers = duel.loser ?? [];
        const bowed = losers.filter((card) => bow().canAffect(card, context));
        const losingFate = this.wonByDuelist(duel) ? losers.filter((card) => removeFate().canAffect(card, context)) : [];
        if(losingFate.length === 0) {
            return msg`bow ${bowed}`;
        }
        if(bowed.length === 0) {
            return msg`remove 1 fate from ${losingFate}`;
        }
        if(bowed.length === losingFate.length && bowed.every((card) => losingFate.includes(card))) {
            return msg`bow and remove 1 fate from ${bowed}`;
        }
        return msg`bow ${bowed} and remove 1 fate from ${losingFate}`;
    }

    wonByDuelist(duel: ResolvedDuel): boolean {
        return duel.winner.some((char) => char.hasTrait(Trait.Duelist));
    }
}
