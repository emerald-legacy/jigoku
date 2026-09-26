import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BayushiYunako extends DrawCard {
    static id = 'bayushi-yunako';

    setupCardAbilities() {
        this.action('Switch a character\'s M and P skill')
            .condition(context => context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => !card.hasDash()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.switchBaseSkills()
            }))
            .effect('switch {0}\'s military and political skill');
    }
}


export default BayushiYunako;
