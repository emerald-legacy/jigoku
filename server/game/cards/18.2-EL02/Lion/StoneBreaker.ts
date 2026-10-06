import DrawCard from '../../../DrawCard.js';
import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { moveCardInProvinceAction } from '../../moveCardInProvince.js';

class StoneBreaker extends DrawCard {
    static id = 'stone-breaker';

    setupCardAbilities() {
        moveCardInProvinceAction(this)
            .cost(AbilityDsl.costs.sacrificeSelf())
            .gameAction(AbilityDsl.actions.refillFaceup(context => ({ location: context.cardStateWhenInitiated?.location ?? [] })));

        this.conflictAction('Reduce province strength')
            .gameAction(AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.isProvinceCard() && card.getStrength() > 0,
                message: '{0} reduces the strength of {1} by 2',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(-2)
                })
            })))
            .effect('reduce an attacked province strength by 2');
    }
}


export default StoneBreaker;
