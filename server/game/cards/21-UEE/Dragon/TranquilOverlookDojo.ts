import AbilityDsl from '../../../abilitydsl.js';
import { DuelType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import { shuffle } from '../../../utils/shuffle.js';
import type { AbilityLimit } from '../../../AbilityLimit.js';

export default class TranquilOverlookDojo extends StrongholdCard {
    static id = 'tranquil-overlook-dojo';

    setupCardAbilities() {
        const limit = AbilityDsl.limit.perRound(1);
        actionVersion(this, limit, DuelType.Military, 'Initiate a Military duel');
        actionVersion(this, limit, DuelType.Political, 'Initiate a Political duel');
    }
}

function actionVersion(self: TranquilOverlookDojo, limit: AbilityLimit, type: DuelType, title: string) {
    self.action({
        title,
        cost: AbilityDsl.costs.bowSelf(),
        initiateDuel: {
            type,
            opponentChoosesDuelTarget: true,
            gameAction: (duel) =>
                AbilityDsl.actions.conditional({
                    condition: (context) => duel.winningPlayer === context.player,
                    falseGameAction: AbilityDsl.actions.noAction(),
                    trueGameAction: AbilityDsl.actions.sequentialContext((context) => {
                        const revealedCards = (shuffle(context.player.opponent.hand) as Array<DrawCard>)
                            .slice(0, 2)
                            .sort((a, b) => a.name.localeCompare(b.name));
                        return {
                            gameActions: [
                                AbilityDsl.actions.lookAt((context) => ({
                                    target: revealedCards,
                                    message: '{0} reveals {1} from their hand',
                                    messageArgs: (cards) => [context.player.opponent, cards]
                                })),
                                AbilityDsl.actions.cardMenu({
                                    activePromptTitle: 'Choose a card to discard',
                                    cards: revealedCards,
                                    targets: true,
                                    player: Players.Self,
                                    message: '{0} discards {1}',
                                    messageArgs: (card, player) => [player, card],
                                    gameAction: AbilityDsl.actions.discardCard()
                                })
                            ]
                        };
                    })
                })
        },
        max: limit
    });
}
