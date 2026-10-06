import AbilityDsl from '../../abilitydsl.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class DiscouragePursuit extends DrawCard {
    static id = 'discourage-pursuit';

    setupCardAbilities() {
        this.action('Give -4 military to a participating character')
            .cost(AbilityDsl.costs.dishonor({ cardCondition: card => card.hasTrait('shinobi') }))
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyMilitarySkill(-4)
            }))
            .effect('reduce {0}\'s military skill by 4');
    }
}


export default DiscouragePursuit;
