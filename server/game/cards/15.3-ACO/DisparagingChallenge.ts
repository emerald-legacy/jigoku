import DrawCard from '../../DrawCard.js';
import { conditional, moveToConflict, sendHome } from '../../GameActions/GameActions.js';
import { DuelType } from '../../Constants.js';

class DisparagingChallenge extends DrawCard {
    static id = 'disparaging-challenge';

    setupCardAbilities() {
        this.action('Initiate a political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                targetCondition: (card) => !card.isParticipating(),
                gameAction: (duel) => conditional({
                    condition: () => !duel.loser?.[0]?.isParticipating(),
                    trueGameAction: moveToConflict({ target: duel.loser }),
                    falseGameAction: sendHome({ target: duel.loser })
                })
            }));
    }
}


export default DisparagingChallenge;
