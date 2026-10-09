import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { selectRing, switchConflictElement } from '../../GameActions/GameActions.js';


class ShinjoKyora extends DrawCard {
    static id = 'shinjo-kyora';

    setupCardAbilities() {
        this.action('Switch the contested ring')
            .condition((context) => context.source.isParticipating())
            .gameAction(selectRing({
                message: (_context, ring, player) => msg`${player} switches the contested ring with ${ring}`,
                ringCondition: (ring) => ring.isUnclaimed(),
                gameAction: switchConflictElement()
            }))
            .chatText('switch the contested ring with an unclaimed one');
    }
}


export default ShinjoKyora;
