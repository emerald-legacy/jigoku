import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class StoicMagistrate extends DrawCard {
    static id = 'stoic-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: cannotContribute(() => {
                return (card) => card.costLessThan(3);
            })
        });
    }
}


export default StoicMagistrate;
