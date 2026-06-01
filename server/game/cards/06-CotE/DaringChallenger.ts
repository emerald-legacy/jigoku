import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelTypes } from '../../Constants.js';

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
                type: DuelTypes.Military,
                gameAction: (duel: any) => AbilityDsl.actions.placeFate({
                    target: duel.winner
                })
            }
        });
    }
}


export default DaringChallenger;
