import DrawCard from '../../drawcard.js';

class ImperialStorehouse extends DrawCard {
    static id = 'imperial-storehouse';

    setupCardAbilities(ability) {
        this.action({
            title: 'Draw a card',
            cost: ability.costs.sacrificeSelf(),
            gameAction: ability.actions.draw()
        });
    }
}


export default ImperialStorehouse;
