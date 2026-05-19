import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class SeveredFromTheStream extends DrawCard {
    static id = 'severed-from-the-stream';

    setupCardAbilities() {
        this.action({
            title: 'Return player\'s rings',
            gameAction: AbilityDsl.actions.performGloryCount({
                gameAction: winner => winner && winner.opponent && AbilityDsl.actions.returnRing({
                    target: winner.opponent.getClaimedRings()
                })
            })
        });
    }
}


export default SeveredFromTheStream;
