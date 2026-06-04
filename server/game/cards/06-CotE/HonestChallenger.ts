import { CardType, DuelType, Players } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type { Duel } from '../../Duel.js';

export default class HonestChallenger extends DrawCard {
    static id = 'honest-challenger';

    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });

        this.action({
            title: 'Initiate a military duel',
            initiateDuel: (context: AbilityContext) => ({
                type: DuelType.Military,
                message: '{0} chooses a character to move to the conflict',
                messageArgs: (duel: Duel) => duel.winnerController,
                gameAction: (duel: Duel) =>
                    duel.winner
                        ? AbilityDsl.actions.selectCard({
                            activePromptTitle: 'Choose a character to move to the conflict',
                            cardType: CardType.Character,
                            player: duel.winnerController === context.player ? Players.Self : Players.Opponent,
                            controller: duel.winnerController === context.player ? Players.Self : Players.Opponent,
                            message: '{0} moves {1} to the conflict',
                            messageArgs: (card, player) => [player, card],
                            gameAction: AbilityDsl.actions.moveToConflict()
                        })
                        : AbilityDsl.actions.noAction()
            })
        });
    }
}
