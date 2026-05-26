import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HurricanePunch extends DrawCard {
    static id = 'hurricane-punch';

    setupCardAbilities(_ability: typeof AbilityDsl) {
        this.action({
            title: 'Increase a monk\'s military skill and draw 1 card',
            effect: 'grant 2 military skill to {0} and draw a card',

            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyMilitarySkill(2)
                }))
            },
            gameAction: AbilityDsl.actions.draw()
        });
    }
}


export default HurricanePunch;
