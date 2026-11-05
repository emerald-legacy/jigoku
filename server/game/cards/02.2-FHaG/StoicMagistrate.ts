import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class StoicMagistrate extends DrawCard {
    static id = 'stoic-magistrate';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending(),
            effect: cannotContribute((card) => card.costLessThan(3))
        });
    }
}


export default StoicMagistrate;
