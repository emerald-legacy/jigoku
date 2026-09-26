import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class VenerableFortunist extends DrawCard {
    static id = 'venerable-fortunist';

    setupCardAbilities() {
        this.action('Gain 2 fate')
            .cost(AbilityDsl.costs.returnRings(1, (ring, context) => (context.player.role?.getElement() ?? []).some(a => ring.hasElement(a))))
            .condition(context => !!context.player.role)
            .gameAction(AbilityDsl.actions.gainFate(({ amount: 2})))
            .effect('gain 2 fate');
    }
}


export default VenerableFortunist;
