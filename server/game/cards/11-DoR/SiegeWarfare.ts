import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class SiegeWarfare extends DrawCard {
    static id = 'siege-warfare';

    setupCardAbilities() {
        this.action('Give attacked province -2 strength')
            .condition(context => context.player.isAttackingPlayer() && context.player.getNumberOfHoldingsInPlay() > 0)
            .selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.isProvinceCard() && card.getStrength() > 0,
                message: '{0} reduces the strength of {1} by 2',
                messageArgs: cards => [context.player, cards],
                gameAction: cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(-2)
                }))
            }))
            .effect('reduce the province strength of an attacked province by 2');
    }
}


export default SiegeWarfare;
