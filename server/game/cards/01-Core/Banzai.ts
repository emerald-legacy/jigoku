import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
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
            .effect('grant 2 military skill to {0}')
            .mayResolveTwice({ cost: loseHonor(), label: 'Lose 1 honor' })
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default Banzai;
