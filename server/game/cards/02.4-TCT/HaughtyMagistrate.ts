import DrawCard from '../../DrawCard.js';
import { cannotContribute } from '../../effects.js';

class HaughtyMagistrate extends DrawCard {
    static id = 'haughty-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: cannotContribute((_conflict, context) => {
                return (card) => context.source.isDrawCard() && card.getGlory() < context.source.getGlory() && card !== context.source;
            })
        });
    }
}


export default HaughtyMagistrate;
