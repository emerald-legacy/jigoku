import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class HumbleMagistrate extends DrawCard {
    static id = 'humble-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            effect: cannotContribute(() => {
                return (card) => (card.printedCost ?? 0) >= 4;
            })
        });
    }
}


export default HumbleMagistrate;
