import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class ImplacableMagistrate extends DrawCard {
    static id = 'implacable-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            effect: cannotContribute((_conflict, context) => {
                return (card) => !card.isHonored && card !== context.source;
            })
        });
    }
}


export default ImplacableMagistrate;
