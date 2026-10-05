import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ImplacableMagistrate extends DrawCard {
    static id = 'implacable-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((_conflict, context) => {
                return (card) => !card.isHonored && card !== context.source;
            })
        });
    }
}


export default ImplacableMagistrate;
