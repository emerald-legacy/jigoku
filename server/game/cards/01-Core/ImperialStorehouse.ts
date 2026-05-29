import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ImperialStorehouse extends DrawCard {
    static id = 'imperial-storehouse';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Draw a card',
            cost: ability.costs.sacrificeSelf(),
            gameAction: ability.actions.draw()
        });
    }
}


export default ImperialStorehouse;
