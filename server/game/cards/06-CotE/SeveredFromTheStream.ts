import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';
import { chatMessage, noAction, performGloryCount, returnRing, sequential } from '../../GameActions/GameActions.js';

class SeveredFromTheStream extends DrawCard {
    static id = 'severed-from-the-stream';

    override setupCardAbilities() {
        this.action('Return player\'s rings')
            .gameAction(performGloryCount({
                gameAction: (winner) => {
                    const loser = winner?.opponent;
                    const rings = loser ? loser.getClaimedRings().filter((ring) => ring.isClaimedBy(loser)) : [];
                    if(!loser || rings.length === 0) {
                        return noAction();
                    }
                    return sequential([
                        chatMessage(() => msg`${loser} returns the ${rings} to the unclaimed ring pool`),
                        returnRing({ target: rings })
                    ]);
                }
            }));
    }
}


export default SeveredFromTheStream;
