import DrawCard from '../../DrawCard.js';
import { cancel, noAction } from '../../GameActions/GameActions.js';
import { CardType, DuelType } from '../../Constants.js';

class DefendYourHonor extends DrawCard {
    static id = 'defend-your-honor';

    setupCardAbilities() {
        this.wouldInterrupt('Initiate a military duel')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    context.game.isDuringConflict() &&
                    event.card.type === CardType.Event && event.context.player === context.player.opponent
            })
            .initiateDuel((context) => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                gameAction: (duel) => (duel.winner && duel.winningPlayer === context.player) ? cancel() : noAction()
            }));
    }
}


export default DefendYourHonor;
