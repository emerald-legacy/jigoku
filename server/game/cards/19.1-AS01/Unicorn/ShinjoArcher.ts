import AbilityDsl from '../../../abilitydsl.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoArcher extends DrawCard {
    static id = 'shinjo-archer';

    public setupCardAbilities() {
        this.action('Move and give -2/-2')
            .cost(AbilityDsl.costs.switchLocation())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({
                effect: modifyBothSkills(-2)
            }))
            .effect('give {0} -2{2}/-2{3}', (context) => [context.source, 'military', 'political']);
    }
}
