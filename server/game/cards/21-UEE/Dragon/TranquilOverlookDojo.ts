import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import {
    cardMenu,
    conditional,
    discardCard,
    lookAt,
    sequentialContext
} from '../../../GameActions/GameActions.js';
import { DuelType, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import { perRound, type AbilityLimit } from '../../../AbilityLimit.js';
import { randomHandCards } from '../../randomHandCards.js';

export default class TranquilOverlookDojo extends StrongholdCard {
    static id = 'tranquil-overlook-dojo';

    setupCardAbilities() {
        const limit = perRound(1);
        actionVersion(this, limit, DuelType.Military, 'Initiate a Military duel');
        actionVersion(this, limit, DuelType.Political, 'Initiate a Political duel');
    }
}

function actionVersion(self: TranquilOverlookDojo, limit: AbilityLimit, type: DuelType, title: string) {
    self.action(title)
        .condition((context) => context.game.isDuringConflict())
        .cost(costs.bowSelf())
        .initiateDuel(() => ({
            type,
            opponentChoosesDuelTarget: true,
            gameAction: (duel) =>
                conditional({
                    condition: (context) => duel.winningPlayer === context.player,
                    trueGameAction: sequentialContext((context) => {
                        const revealedCards = randomHandCards(context.player.opponent, 2);
                        return {
                            gameActions: [
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
                            ]
                        };
                    })
                })
        }))
        .max(limit);
}
