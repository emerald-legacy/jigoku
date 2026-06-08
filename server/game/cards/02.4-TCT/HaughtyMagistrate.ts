import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type { EffectTarget } from '../../Effects/EffectBuilder.js';
import type { AbilityContext } from '../../AbilityContext.js';

class HaughtyMagistrate extends DrawCard {
    static id = 'haughty-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((_conflict: EffectTarget, context: AbilityContext) => {
                return (card: DrawCard) => card.getGlory() < (context.source as DrawCard).getGlory() && card !== context.source;
            })
        });
    }
}


export default HaughtyMagistrate;
