import { CardTypes, DuelTypes, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class HonestChallenger extends DrawCard {
    static id = 'honest-challenger';

    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });

        this.action({
            title: 'Initiate a military duel',
            initiateDuel: (context: any) => ({
                type: DuelTypes.Military,
                message: '{0} chooses a character to move to the conflict',
                messageArgs: (duel: any) => duel.winnerController,
                gameAction: (duel: any) =>
                    duel.winner
                        ? AbilityDsl.actions.selectCard({
                            activePromptTitle: 'Choose a character to move to the conflict',
                            cardType: CardTypes.Character,
                            player: duel.winnerController === context.player ? Players.Self : Players.Opponent,
                            controller: duel.winnerController === context.player ? Players.Self : Players.Opponent,
                            message: '{0} moves {1} to the conflict',
                            messageArgs: (card: any, player: any) => [player, card],
                            gameAction: AbilityDsl.actions.moveToConflict()
                        })
                        : AbilityDsl.actions.noAction()
            })
        });
    }
}
