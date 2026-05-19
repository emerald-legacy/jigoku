import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class HurricanePunch extends DrawCard {
    static id = 'hurricane-punch';

    setupCardAbilities(ability) {
        this.action({
            title: 'Increase a monk\'s military skill and draw 1 card',
            effect: 'grant 2 military skill to {0} and draw a card',

            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk'),
                gameAction: ability.actions.cardLastingEffect(() => ({
                    effect: ability.effects.modifyMilitarySkill(2)
                }))
            },
            gameAction: ability.actions.draw()
        });
    }
}


export default HurricanePunch;
