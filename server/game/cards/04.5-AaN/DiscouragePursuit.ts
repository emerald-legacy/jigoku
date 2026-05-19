import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class DiscouragePursuit extends DrawCard {
    static id = 'discourage-pursuit';

    setupCardAbilities(ability) {
        this.action({
            title: 'Give -4 military to a participating character',

            cost: ability.costs.dishonor({ cardCondition: card => card.hasTrait('shinobi') }),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(() => ({
                    effect: ability.effects.modifyMilitarySkill(-4)
                }))
            },
            effect: 'reduce {0}\'s military skill by 4'
        });
    }
}


export default DiscouragePursuit;
