import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';

class NightshadeInfiltrator extends DrawCard {
    static id = 'nightshade-infiltrator';

    setupCardAbilities() {
        this.action({
            title: 'Give a character -3/-3',
            cost: AbilityDsl.costs.dishonorSelf(),
            condition: context => context.source.isParticipating(),
            target: {
                player: Players.Self,
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.target,
                    effect: AbilityDsl.effects.modifyBothSkills(-3)
                }))
            },
            effect: 'give {0} -3{1}/-3{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}

export default NightshadeInfiltrator;
