import { msg } from '../../GameChat.js';
import { CardType, DuelType } from '../../Constants.js';
import { modifyMilitarySkill } from '../../effects.js';
import { moveToConflict, selectCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class HonestChallenger extends DrawCard {
    static id = 'honest-challenger';

    override setupCardAbilities() {
        this.composure({
            effect: modifyMilitarySkill(2)
        });

        this.action('Initiate a military duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                chatText: (_context, duel) => msg`${duel.winnerController} chooses a character to move to the conflict`,
                gameAction: (duel) =>
                    selectCard({
                        activePromptTitle: 'Choose a character to move to the conflict',
                        cardType: CardType.Character,
                        player: duel.winnerController,
                        cardCondition: (card) => card.controller === duel.winnerController,
                        message: (_context, card, player) => msg`${player} moves ${card} to the conflict`,
                        gameAction: moveToConflict()
                    })
            }));
    }
}
