import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelTypes } from '../../Constants.js';

class HonorableChallenger extends DrawCard {
    static id = 'honorable-challenger';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                message: '{0} will not bow as a result of this conflict\'s resolution',
                messageArgs: duel => duel.winner,
                gameAction: duel => AbilityDsl.actions.cardLastingEffect({
                    target: duel.winner,
                    effect: AbilityDsl.effects.doesNotBow()
                })
            }
        });
    }
}


export default HonorableChallenger;
