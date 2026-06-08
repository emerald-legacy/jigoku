import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type { EffectTarget } from '../../Effects/EffectBuilder.js';
import type { AbilityContext } from '../../AbilityContext.js';

class SilverTonguedMagistrate extends DrawCard {
    static id = 'silver-tongued-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((conflict: EffectTarget, context: AbilityContext) => {
                return (card: DrawCard) => card.getFate() === 0 && card !== context.source;
            })
        });
    }
}


export default SilverTonguedMagistrate;
