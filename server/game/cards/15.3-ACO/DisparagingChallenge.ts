import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { DuelTypes } from '../../Constants';

class DisparagingChallenge extends DrawCard {
    static id = 'disparaging-challenge';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            initiateDuel: {
                type: DuelTypes.Political,
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
