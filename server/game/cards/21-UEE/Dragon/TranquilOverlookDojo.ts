import AbilityDsl from '../../../abilitydsl';
import { DuelTypes, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';
import { StrongholdCard } from '../../../StrongholdCard';
import type { AbilityLimit } from '../../../AbilityLimit';

export default class TranquilOverlookDojo extends StrongholdCard {
    static id = 'tranquil-overlook-dojo';

    setupCardAbilities() {
        const limit = AbilityDsl.limit.perRound(1);
        this.#actionVersion(limit, DuelTypes.Military, 'Initiate a Military duel');
        this.#actionVersion(limit, DuelTypes.Political, 'Initiate a Political duel');
    }

    #actionVersion(limit: AbilityLimit, type: DuelTypes, title: string) {
        this.action({
            title,
            condition: (context) => context.game.isDuringConflict(),
            initiateDuel: {
                type,
                opponentChoosesDuelTarget: true,
                gameAction: (duel) =>
                    AbilityDsl.actions.conditional({
                        condition: (context) => duel.winningPlayer === context.player,
                        falseGameAction: AbilityDsl.actions.noAction(),
                        trueGameAction: AbilityDsl.actions.sequentialContext((context) => {
                            const revealedCards = (context.player.opponent.hand.shuffle() as Array<DrawCard>)
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
}
