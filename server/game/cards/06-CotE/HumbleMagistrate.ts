import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class HumbleMagistrate extends DrawCard {
    static id = 'humble-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute(() => {
                return (card: any) => card.printedCost >= 4;
            })
        });
    }
}


export default HumbleMagistrate;
