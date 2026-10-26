import DrawCard from '../../DrawCard.js';
import { placeFateOnRing, sequential, switchConflictElement } from '../../GameActions/GameActions.js';

class ElementalInversion extends DrawCard {
    static id = 'elemental-inversion';

    override setupCardAbilities() {
        this.action('Switch the contested ring')
            .condition((context) => context.game.isDuringConflict())
            .ringTarget({
                activePromptTitle: 'Choose an uncontested ring',
                ringCondition: (ring, context) => !ring.isContested() && !ring.isRemovedFromGame() &&
                    (ring.isUnclaimed() || ring.isClaimedBy(context.game.currentConflict?.attackingPlayer))
            }, sequential([
                placeFateOnRing((context) => ({
                    origin: context.ring,
                    target: context.game.currentConflict?.ring,
                    amount: context.ring?.fate
                })),
                switchConflictElement()
            ]))
            .chatText('move all fate from the {0} and switch it with the contested ring');
    }
}


export default ElementalInversion;
