import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelType } from '../../Constants.js';

class DisparagingChallenge extends DrawCard {
    static id = 'disparaging-challenge';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            initiateDuel: {
                type: DuelType.Political,
                targetCondition: card => !card.isParticipating(),
                gameAction: duel => AbilityDsl.actions.conditional({
                    condition: () => !duel.loser?.[0]?.isParticipating(),
                    trueGameAction: AbilityDsl.actions.moveToConflict({ target: duel.loser }),
                    falseGameAction: AbilityDsl.actions.sendHome({ target: duel.loser })
                })
            }
        });
    }
}


export default DisparagingChallenge;
