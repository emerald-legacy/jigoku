import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { modifyMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class FearlessSailor extends DrawCard {
    static id = 'fearless-sailor';

    setupCardAbilities() {
        this.action('Give a character -2 military')
            .condition(context => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.hasStatusTokens && card.isParticipating()
            }, cardLastingEffect({
                effect: modifyMilitarySkill(-2)
            }))
            .effect('give {0} -2{1}', () => ['military']);
    }
}


export default FearlessSailor;
