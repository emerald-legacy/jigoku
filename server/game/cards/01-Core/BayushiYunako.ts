import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BayushiYunako extends DrawCard {
    static id = 'bayushi-yunako';

    setupCardAbilities() {
        this.action({
            title: 'Switch a character\'s M and P skill',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => !card.hasDash(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.switchBaseSkills()
                })
            },
            effect: 'switch {0}\'s military and political skill'
        });
    }
}


export default BayushiYunako;
