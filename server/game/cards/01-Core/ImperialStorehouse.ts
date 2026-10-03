import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ImperialStorehouse extends DrawCard {
    static id = 'imperial-storehouse';

    setupCardAbilities() {
        this.action('Draw a card')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .gameAction(AbilityDsl.actions.draw());
    }
}


export default ImperialStorehouse;
