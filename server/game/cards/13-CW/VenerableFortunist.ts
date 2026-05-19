import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class VenerableFortunist extends DrawCard {
    static id = 'venerable-fortunist';

    setupCardAbilities() {
        this.action({
            title: 'Gain 2 fate',
            condition: context => !!context.player.role,
            cost: AbilityDsl.costs.returnRings(1, (ring, context) => context.player.role.getElement().some(a => ring.hasElement(a))),
            gameAction: AbilityDsl.actions.gainFate(({ amount: 2})),
            effect: 'gain 2 fate'
        });
    }
}


export default VenerableFortunist;
