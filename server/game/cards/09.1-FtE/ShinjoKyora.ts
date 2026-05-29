import DrawCard from '../../DrawCard.js';
import AbiltyDsl from '../../abilitydsl.js';


class ShinjoKyora extends DrawCard {
    static id = 'shinjo-kyora';

    setupCardAbilities() {
        this.action({
            title: 'Switch the contested ring',
            condition: context => context.source.isParticipating(),
            gameAction: AbiltyDsl.actions.selectRing({
                message: '{0} switches the contested ring with {1}',
                ringCondition: ring => ring.isUnclaimed(),
                messageArgs: (ring, player) => [player, ring],
                gameAction: AbiltyDsl.actions.switchConflictElement()
            }),
            effect: 'switch the contested ring with an unclaimed one'
        });
    }
}


export default ShinjoKyora;
