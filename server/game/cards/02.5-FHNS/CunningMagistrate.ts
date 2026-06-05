import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { EffectTarget } from '../../Effects/EffectBuilder.js';
import AbilityDsl from '../../abilitydsl.js';

class CunningMagistrate extends DrawCard {
    static id = 'cunning-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.cannotContribute((_conflict: EffectTarget, context: AbilityContext) => {
                return (card: DrawCard) => card.isDishonored && card !== context.source;
            })
        });
    }
}


export default CunningMagistrate;
