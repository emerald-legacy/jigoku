import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { EffectTarget } from '../../Effects/EffectBuilder.js';
import AbilityDsl from '../../abilitydsl.js';

class SwiftMagistrate extends DrawCard {
    static id = 'swift-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext) => (context.source as DrawCard).isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((_conflict: EffectTarget, context: AbilityContext) => {
                return (card: DrawCard) => card.getFate() > 0 && card !== context.source;
            })
        });
    }
}


export default SwiftMagistrate;
