import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class GuardianOfVirtue extends DrawCard {
    static id = 'guardian-of-virtue';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending() && context.player.hasComposure(),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}


export default GuardianOfVirtue;
