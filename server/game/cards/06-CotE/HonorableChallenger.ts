import DrawCard from '../../DrawCard.js';
import { doesNotBow } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { DuelType } from '../../Constants.js';

class HonorableChallenger extends DrawCard {
    static id = 'honorable-challenger';

    setupCardAbilities() {
        this.action('Initiate a military duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                message: '{0} will not bow as a result of this conflict\'s resolution',
                messageArgs: (duel) => duel.winner,
                gameAction: (duel) => cardLastingEffect({
                    target: duel.winner,
                    effect: doesNotBow()
                })
            }));
    }
}


export default HonorableChallenger;
