import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import { Location, CardType, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { isEnumValue } from '../../utils/helpers.js';

class SpecializedDefenses extends DrawCard {
    static id = 'specialized-defenses';

    setupCardAbilities() {
        this.action('Double province strength')
            .condition((context) => context.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card: BaseCard) => card.isConflictProvince() && card.isProvinceCard() && card.element.some((element: string) => {
                    if(element === 'all') {
                        return true;
                    }
                    return this.game.rings[element].isConsideredClaimed(context.player) ||
                           (isEnumValue(Element, element) && (this.game.currentConflict?.ring?.getElements().includes(element) ?? false));
                }),
                message: '{0} doubles the province strength of {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrengthMultiplier(2)
                }))
            })))
            .effect('double the province strength of an attacked province');
    }
}


export default SpecializedDefenses;
