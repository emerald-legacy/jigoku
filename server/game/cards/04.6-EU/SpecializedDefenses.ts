import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Location, CardType, Element } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SpecializedDefenses extends DrawCard {
    static id = 'specialized-defenses';

    setupCardAbilities() {
        this.action({
            title: 'Double province strength',
            condition: (context: AbilityContext) => context.game.isDuringConflict(),
            effect: 'double the province strength of an attacked province',
            gameAction: AbilityDsl.actions.selectCard((context: AbilityContext) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card: BaseCard) => card.isConflictProvince() && (card as ProvinceCard).element.some((element: string) => {
                    if(element === 'all') {
                        return true;
                    }
                    return this.game.rings[element].isConsideredClaimed(context.player) ||
                           (this.game.currentConflict?.ring?.getElements().includes(element as Element) ?? false);
                }),
                message: '{0} doubles the province strength of {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrengthMultiplier(2)
                }))
            }))
        });
    }
}


export default SpecializedDefenses;
