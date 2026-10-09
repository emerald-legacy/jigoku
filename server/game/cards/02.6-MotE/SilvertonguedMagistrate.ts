import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class SilverTonguedMagistrate extends DrawCard {
    static id = 'silver-tongued-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            effect: cannotContribute((_conflict, context) => {
                return (card) => card.getFate() === 0 && card !== context.source;
            })
        });
    }
}


export default SilverTonguedMagistrate;
