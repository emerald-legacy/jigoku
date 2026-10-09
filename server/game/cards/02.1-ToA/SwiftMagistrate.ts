import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class SwiftMagistrate extends DrawCard {
    static id = 'swift-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            effect: cannotContribute((_conflict, context) => {
                return (card) => card.getFate() > 0 && card !== context.source;
            })
        });
    }
}


export default SwiftMagistrate;
