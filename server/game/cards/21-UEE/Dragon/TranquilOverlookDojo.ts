import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import {
    cardMenu,
    discardCard,
    lookAt,
    noAction,
    sequential
} from '../../../GameActions/GameActions.js';
import { DuelType, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import { perRound, type AbilityLimit } from '../../../AbilityLimit.js';
import { randomHandCards } from '../../randomHandCards.js';

export default class TranquilOverlookDojo extends StrongholdCard {
    static id = 'tranquil-overlook-dojo';

    override setupCardAbilities() {
        const limit = perRound(1);
        actionVersion(this, limit, DuelType.Military, 'Initiate a Military duel');
        actionVersion(this, limit, DuelType.Political, 'Initiate a Political duel');
    }
}

function actionVersion(self: TranquilOverlookDojo, limit: AbilityLimit, type: DuelType, title: string) {
    self.action(title)
        .condition((context) => context.game.isDuringConflict())
        .cost(costs.bowSelf())
        .initiateDuel((context) => ({
            type,
            opponentChoosesDuelTarget: true,
            // losing the duel resolves nothing: "The duel has no effect"
            gameAction: (duel) => duel.winningPlayer === context.player
                ? sequential((context) => {
                    const revealedCards = randomHandCards(context.player.opponent, 2);
                    return [
                        lookAt({
                            target: revealedCards,
                            message: (context, cards) => msg`${context.player.opponent} reveals ${cards} from their hand`
                        }),
                        cardMenu({
                            activePromptTitle: 'Choose a card to discard',
                            cards: revealedCards,
                            targets: true,
                            player: Players.Self,
                            message: (_context, card, player) => msg`${player} discards ${card}`,
                            gameAction: discardCard()
                        })
                    ];
                })
                : noAction(),
            chatText: (context) => {
                const amount = Math.min(2, context.player.opponent?.hand.length ?? 0);
                return msg`reveal ${amount} random card${amount === 1 ? '' : 's'} from ${context.player.opponent}'s hand and discard ${amount === 1 ? 'it' : '1 of them'}`;
            }
        }))
        .max(limit);
}
