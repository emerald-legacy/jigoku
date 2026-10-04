import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelType } from '../../Constants.js';

class DaringChallenger extends DrawCard {
    static id = 'daring-challenger';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => Boolean(context.player.opponent) && context.player.isLessHonorable(),
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.action('Initiate a Military duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel) => AbilityDsl.actions.placeFate({
                    target: duel.winner
                })
            }));
    }
}


export default DaringChallenger;
