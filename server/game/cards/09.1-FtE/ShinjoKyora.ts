import DrawCard from '../../DrawCard.js';
import { selectRing, switchConflictElement } from '../../GameActions/GameActions.js';


class ShinjoKyora extends DrawCard {
    static id = 'shinjo-kyora';

    setupCardAbilities() {
        this.action('Switch the contested ring')
            .condition((context) => context.source.isParticipating())
            .gameAction(selectRing({
                message: '{0} switches the contested ring with {1}',
                ringCondition: (ring) => ring.isUnclaimed(),
                messageArgs: (ring, player) => [player, ring],
                gameAction: switchConflictElement()
            }))
            .chatText('switch the contested ring with an unclaimed one');
    }
}


export default ShinjoKyora;
