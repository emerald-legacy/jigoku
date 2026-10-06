import DrawCard from '../../DrawCard.js';
import { removeFate } from '../../GameActions/GameActions.js';
import { DuelType } from '../../Constants.js';

class Heresy extends DrawCard {
    static id = 'heresy';

    setupCardAbilities() {
        this.action('Initiate a political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                opponentChoosesChallenger: true,
                message: 'remove a fate from {0}',
                messageArgs: duel => [duel.loser],
                gameAction: duel => removeFate({
                    target: duel.loser
                })
            }));
    }
}


export default Heresy;
