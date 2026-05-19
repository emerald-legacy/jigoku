import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelTypes } from '../../Constants.js';

class Heresy extends DrawCard {
    static id = 'heresy';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                opponentChoosesChallenger: true,
                message: 'remove a fate from {0}',
                messageArgs: duel => [duel.loser],
                gameAction: duel => AbilityDsl.actions.removeFate({
                    target: duel.loser,
                    amount: 1
                })
            }
        });
    }
}


export default Heresy;
