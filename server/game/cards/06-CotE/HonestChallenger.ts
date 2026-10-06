import { CardType, DuelType, Players } from '../../Constants.js';
import { modifyMilitarySkill } from '../../effects.js';
import { moveToConflict, noAction, selectCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class HonestChallenger extends DrawCard {
    static id = 'honest-challenger';

    setupCardAbilities() {
        this.composure({
            effect: modifyMilitarySkill(2)
        });

        this.action('Initiate a military duel')
            .initiateDuel((context) => ({
                type: DuelType.Military,
                message: '{0} chooses a character to move to the conflict',
                messageArgs: (duel) => duel.winnerController,
                gameAction: (duel) =>
                    duel.winner
                        ? selectCard({
                            activePromptTitle: 'Choose a character to move to the conflict',
                            cardType: CardType.Character,
                            player: duel.winnerController === context.player ? Players.Self : Players.Opponent,
                            controller: duel.winnerController === context.player ? Players.Self : Players.Opponent,
                            message: '{0} moves {1} to the conflict',
                            messageArgs: (card, player) => [player, card],
                            gameAction: moveToConflict()
                        })
                        : noAction()
            }));
    }
}
