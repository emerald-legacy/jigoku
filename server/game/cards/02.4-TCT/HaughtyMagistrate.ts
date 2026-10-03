import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type { EffectTarget } from '../../Effects/EffectBuilder.js';

class HaughtyMagistrate extends DrawCard {
    static id = 'haughty-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((_conflict: EffectTarget, context) => {
                return (card) => context.source.isDrawCard() && card.getGlory() < context.source.getGlory() && card !== context.source;
            })
        });
    }
}


export default HaughtyMagistrate;
