import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

class GuardianOfVirtue extends DrawCard {
    static id = 'guardian-of-virtue';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: (context: AbilityContext) => context.source.isDefending() && context.player.hasComposure(),
            effect: ability.effects.doesNotBow()
        });
    }
}


export default GuardianOfVirtue;
