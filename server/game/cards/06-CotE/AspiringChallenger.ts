import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelType } from '../../Constants.js';

class AspiringChallenger extends DrawCard {
    static id = 'aspiring-challenger';

    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.modifyGlory(2)
        });
        this.action({
            title: 'Initiate a Military duel',
            initiateDuel: {
                type: DuelType.Military,
                gameAction: duel => AbilityDsl.actions.honor({
                    target: duel.winner
                })
            }
        });
    }
}


export default AspiringChallenger;
