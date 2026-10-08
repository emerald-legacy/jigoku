import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class DisdainfulRemark extends DrawCard {
    static id = 'disdainful-remark';

    setupCardAbilities() {
        this.action('Add Province Strength')
            .condition((context) => context.player.anyCardsInPlay((card) => card.isParticipating() && card.hasTrait('courtier')) &&
                                  !!context.player.opponent && context.player.opponent.hand.length > 0)
            .selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: '{0} increases the strength of {1} by {2}',
                messageArgs: (cards) => [context.player, cards, context.player.opponent?.hand.length ?? 0],
                gameAction: cardLastingEffect((context) => ({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(context.player.opponent?.hand.length ?? 0)
                }))
            }))
            .chatText('increase the strength of an attacked province');
    }
}


export default DisdainfulRemark;
