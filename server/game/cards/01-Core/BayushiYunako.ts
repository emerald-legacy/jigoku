import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { switchBaseSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class BayushiYunako extends DrawCard {
    static id = 'bayushi-yunako';

    setupCardAbilities() {
        this.action('Switch a character\'s M and P skill')
            .condition(context => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: card => !card.hasDash()
            }, cardLastingEffect({
                effect: switchBaseSkills()
            }))
            .effect('switch {0}\'s military and political skill');
    }
}


export default BayushiYunako;
