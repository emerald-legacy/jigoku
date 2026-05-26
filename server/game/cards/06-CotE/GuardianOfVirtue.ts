import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class GuardianOfVirtue extends DrawCard {
    static id = 'guardian-of-virtue';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: (context: any) => context.source.isDefending() && context.player.hasComposure(),
            effect: ability.effects.doesNotBow()
        });
    }
}


export default GuardianOfVirtue;
