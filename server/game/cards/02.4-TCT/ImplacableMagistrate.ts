import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type { EffectTarget } from '../../Effects/EffectBuilder.js';
import type { AbilityContext } from '../../AbilityContext.js';

class ImplacableMagistrate extends DrawCard {
    static id = 'implacable-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((_conflict: EffectTarget, context: AbilityContext) => {
                return (card: DrawCard) => !card.isHonored && card !== context.source;
            })
        });
    }
}


export default ImplacableMagistrate;
