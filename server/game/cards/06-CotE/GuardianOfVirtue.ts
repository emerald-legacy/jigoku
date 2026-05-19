import DrawCard from '../../drawcard.js';

class GuardianOfVirtue extends DrawCard {
    static id = 'guardian-of-virtue';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isDefending() && context.player.hasComposure(),
            effect: ability.effects.doesNotBow()
        });
    }
}


export default GuardianOfVirtue;
