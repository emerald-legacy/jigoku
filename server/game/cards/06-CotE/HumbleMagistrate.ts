import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class HumbleMagistrate extends DrawCard {
    static id = 'humble-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute(() => {
                return (card) => (card.printedCost ?? 0) >= 4;
            })
        });
    }
}


export default HumbleMagistrate;
