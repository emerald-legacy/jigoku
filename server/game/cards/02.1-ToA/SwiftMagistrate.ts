import DrawCard from '../../DrawCard.js';
import type { EffectTarget } from '../../Effects/EffectBuilder.js';
import AbilityDsl from '../../abilitydsl.js';

class SwiftMagistrate extends DrawCard {
    static id = 'swift-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((_conflict: EffectTarget, context) => {
                return (card) => card.getFate() > 0 && card !== context.source;
            })
        });
    }
}


export default SwiftMagistrate;
