import DrawCard from '../../DrawCard.js';
import { DuelType } from '../../Constants.js';
import { discardFromPlay, dishonor } from '../../GameActions/GameActions.js';

class DuelToTheDeath extends DrawCard {
    static id = 'duel-to-the-death';

    setupCardAbilities() {
        this.action('Initiate a military duel, discarding the loser')
            .initiateDuel(() => ({
                type: DuelType.Military,
                refuseGameAction: dishonor(context => ({ target: context.targets.duelTarget })),
                gameAction: duel => discardFromPlay({ target: duel.loser })
            }));
    }
}


export default DuelToTheDeath;
