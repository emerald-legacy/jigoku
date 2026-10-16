import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class HurricanePunch extends DrawCard {
    static id = 'hurricane-punch';

    override setupCardAbilities() {
        this.action('Increase a monk\'s military skill and draw 1 card')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.hasTrait(Trait.Monk)
            }, cardLastingEffect({
                effect: modifyMilitarySkill(2)
            }))
            .draw()
            .chatText('grant 2 military skill to {0} and draw a card');
    }
}


export default HurricanePunch;
