import DrawCard from '../../DrawCard.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { DuelType } from '../../Constants.js';

class MakeYourCase extends DrawCard {
    static id = 'make-your-case';

    setupCardAbilities() {
        this.action('Initiate a political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                message: '{0}{1}',
                messageArgs: duel => [
                    duel.winner,
                    duel.winner ? ' gains a fate' : ''
                ],
                gameAction: duel => placeFate({
                    target: duel.winner
                })
            }));
    }
}


export default MakeYourCase;
