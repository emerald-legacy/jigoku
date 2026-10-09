import DrawCard from '../../DrawCard.js';
import { noAction, performGloryCount, returnRing } from '../../GameActions/GameActions.js';

class SeveredFromTheStream extends DrawCard {
    static id = 'severed-from-the-stream';

    setupCardAbilities() {
        this.action('Return player\'s rings')
            .gameAction(performGloryCount({
                gameAction: (winner) => (winner && winner.opponent)
                    ? returnRing({ target: winner.opponent.getClaimedRings() })
                    : noAction()
            }));
    }
}


export default SeveredFromTheStream;
