import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelType } from '../../Constants.js';
import type { Duel } from '../../Duel.js';

class DaringChallenger extends DrawCard {
    static id = 'daring-challenger';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => Boolean(context.player.opponent) && context.player.isLessHonorable(),
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.action({
            title: 'Initiate a Military duel',
            initiateDuel: {
                type: DuelType.Military,
                gameAction: (duel: Duel) => AbilityDsl.actions.placeFate({
                    target: duel.winner
                })
            }
        });
    }
}


export default DaringChallenger;
