import DrawCard from '../../DrawCard.js';
import { modifyGlory } from '../../effects.js';
import { honor } from '../../GameActions/GameActions.js';
import { DuelType } from '../../Constants.js';

class AspiringChallenger extends DrawCard {
    static id = 'aspiring-challenger';

    setupCardAbilities() {
        this.composure({
            effect: modifyGlory(2)
        });
        this.action('Initiate a Military duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: duel => honor({
                    target: duel.winner
                })
            }));
    }
}


export default AspiringChallenger;
