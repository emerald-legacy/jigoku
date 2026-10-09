import DrawCard from '../../DrawCard.js';
import { modifyMilitarySkill } from '../../effects.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { DuelType } from '../../Constants.js';

class DaringChallenger extends DrawCard {
    static id = 'daring-challenger';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => Boolean(context.player.opponent) && context.player.isLessHonorable(),
            effect: modifyMilitarySkill(1)
        });

        this.action('Initiate a Military duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel) => placeFate({
                    target: duel.winner
                })
            }));
    }
}


export default DaringChallenger;
