import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { perConflict } from '../../AbilityLimit.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect, loseHonor } from '../../GameActions/GameActions.js';

class Banzai extends DrawCard {
    static id = 'banzai';

    setupCardAbilities() {
        this.action('Increase a character\'s military skill')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyMilitarySkill(2)
            }))
            .chatText('grant 2 military skill to {0}')
            .mayResolveAgain({ cost: loseHonor(), label: 'Lose 1 honor' })
            .max(perConflict(1));
    }
}


export default Banzai;
