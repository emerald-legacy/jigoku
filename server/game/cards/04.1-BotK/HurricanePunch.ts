import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HurricanePunch extends DrawCard {
    static id = 'hurricane-punch';

    setupCardAbilities() {
        this.action('Increase a monk\'s military skill and draw 1 card')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk')
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            }))
            .gameAction(AbilityDsl.actions.draw())
            .effect('grant 2 military skill to {0} and draw a card');
    }
}


export default HurricanePunch;
