import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class HumbleMagistrate extends DrawCard {
    static id = 'humble-magistrate';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            effect: cannotContribute((card) => card.costAtLeast(4))
        });
    }
}


export default HumbleMagistrate;
