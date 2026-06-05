import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type Player from '../../Player.js';

class SeveredFromTheStream extends DrawCard {
    static id = 'severed-from-the-stream';

    setupCardAbilities() {
        this.action({
            title: 'Return player\'s rings',
            gameAction: AbilityDsl.actions.performGloryCount({
                gameAction: (winner: Player | null) => (winner && winner.opponent)
                    ? AbilityDsl.actions.returnRing({ target: winner.opponent.getClaimedRings() })
                    : AbilityDsl.actions.noAction()
            })
        });
    }
}


export default SeveredFromTheStream;
