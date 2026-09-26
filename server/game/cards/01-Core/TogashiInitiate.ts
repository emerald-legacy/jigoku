import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class TogashiInitiate extends DrawCard {
    static id = 'togashi-initiate';

    setupCardAbilities() {
        this.action('Honor this character')
            .cost(AbilityDsl.costs.payFateToRing(1))
            .condition(context => context.source.isAttacking())
            .gameAction(AbilityDsl.actions.honor());
    }
}


export default TogashiInitiate;
