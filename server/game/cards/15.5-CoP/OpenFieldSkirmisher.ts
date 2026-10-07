import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class OpenFieldSkirmisher extends DrawCard {
    static id = 'open-field-skirmisher';

    setupCardAbilities() {
        this.action('Reduce Province Strength')
            .cost(AbilityDsl.costs.removeFateFromSelf())
            .condition(context => context.source.isAttacking())
            .selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.isConflictProvince(),
                message: '{0} reduces the strength of {1} by 3',
                messageArgs: cards => [context.player, cards],
                gameAction: cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(-3)
                }))
            }))
            .effect('reduce the strength of an attacked province by 3');
    }
}


export default OpenFieldSkirmisher;
