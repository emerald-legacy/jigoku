import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class ImplacableMagistrate extends DrawCard {
    static id = 'implacable-magistrate';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            effect: cannotContribute((card, context) => !card.isHonored && card !== context.source)
        });
    }
}


export default ImplacableMagistrate;
