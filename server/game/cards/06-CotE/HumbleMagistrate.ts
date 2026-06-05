import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class HumbleMagistrate extends DrawCard {
    static id = 'humble-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => (context.source as DrawCard).isAttacking(),
            effect: AbilityDsl.effects.cannotContribute(() => {
                return (card: DrawCard) => (card.printedCost ?? 0) >= 4;
            })
        });
    }
}


export default HumbleMagistrate;
