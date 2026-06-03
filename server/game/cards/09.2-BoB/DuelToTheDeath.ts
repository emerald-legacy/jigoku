import DrawCard from '../../DrawCard.js';
import { DuelType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DuelToTheDeath extends DrawCard {
    static id = 'duel-to-the-death';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel, discarding the loser',
            initiateDuel: {
                type: DuelType.Military,
                refuseGameAction: AbilityDsl.actions.dishonor(context => ({ target: context.targets.duelTarget })),
                gameAction: duel => AbilityDsl.actions.discardFromPlay({ target: duel.loser })
            }
        });
    }
}


export default DuelToTheDeath;
