import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FearlessSailor extends DrawCard {
    static id = 'fearless-sailor';

    setupCardAbilities() {
        this.action({
            title: 'Move a fate from a character to a ring',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.hasStatusTokens && card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyMilitarySkill(-2)
                })
            },
            effect: 'give {0} -2{1}',
            effectArgs: () => ['military']
        });
    }
}


export default FearlessSailor;
