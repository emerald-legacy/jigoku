import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelTypes } from '../../Constants.js';

class AspiringChallenger extends DrawCard {
    static id = 'aspiring-challenger';

    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.modifyGlory(2)
        });
        this.action({
            title: 'Initiate a Military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                gameAction: duel => AbilityDsl.actions.honor({
                    target: duel.winner
                })
            }
        });
    }
}


export default AspiringChallenger;
