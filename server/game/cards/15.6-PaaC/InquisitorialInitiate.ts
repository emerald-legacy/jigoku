import type { AbilityContext } from '../../AbilityContext.js';
import { Location, Players, TargetMode } from '../../Constants.js';
import { discardCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

// RRG Effects: a non-targeting effect engages as many entities as possible, so a smaller hand reveals all of it
function revealCount(context: AbilityContext): number {
    const opponent = context.player.opponent;
    if(!opponent) {
        return 0;
    }
    return Math.min(opponent.cardsInPlay.filter((card) => card.getFate() === 0).length, opponent.hand.length);
}

export default class InquisitorialInitiate extends DrawCard {
    static id = 'inquisitorial-initiate';

    public override setupCardAbilities() {
        this.reaction('Discard an opponent\'s card')
            .when({
                afterConflict: (event, context) =>
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    revealCount(context) > 0
            })
            .targetCards({
                activePromptTitle: 'Choose cards to reveal',
                player: Players.Opponent,
                numCardsFunc: revealCount,
                mode: TargetMode.ExactlyVariable,
                location: Location.Hand
            })
            .lookAt((context) => ({
                target: context.targets.target
            }))
            .cardMenu((context) => ({
                cards: context.targets.target.filter((card) => card.isDrawCard()),
                gameAction: discardCard(),
                message: (_context, card, player) => msg`${player} chooses ${card} to be discarded`
            }))
            .chatText((context) => {
                const count = context.targets.target.length;
                return msg`make ${context.player.opponent} reveal ${count} card${count === 1 ? '' : 's'} and discard ${count === 1 ? 'it' : 'one of them'}`;
            });
    }
}
