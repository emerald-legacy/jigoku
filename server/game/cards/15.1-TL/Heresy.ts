import { msg } from '../../GameChat.js';
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
                chatText: (_context, duel) => msg`remove a fate from ${duel.loser}`,
                gameAction: (duel) => removeFate({
                    target: duel.loser
                })
            }));
    }
}


export default Heresy;
