import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ImplacableMagistrate extends DrawCard {
    static id = 'implacable-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((conflict: any, context: any) => {
                return (card: DrawCard) => !card.isHonored && card !== context.source;
            })
        });
    }
}


export default ImplacableMagistrate;
