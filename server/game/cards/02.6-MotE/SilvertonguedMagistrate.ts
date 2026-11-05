import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class SilverTonguedMagistrate extends DrawCard {
    static id = 'silver-tongued-magistrate';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            effect: cannotContribute((card, context) => card.getFate() === 0 && card !== context.source)
        });
    }
}


export default SilverTonguedMagistrate;
