import DrawCard from '../../DrawCard.js';
import { Locations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DisdainfulRemark extends DrawCard {
    static id = 'disdainful-remark';

    setupCardAbilities() {
        this.action({
            title: 'Add Province Strength',
            condition: context => context.player.anyCardsInPlay((card: any) => card.isParticipating() && card.hasTrait('courtier')) &&
                                  !!context.player.opponent && context.player.opponent.hand.length > 0,
            effect: 'increase the strength of an attacked province',
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: (card: any) => card.isConflictProvince(),
                message: '{0} increases the strength of {1} by {2}',
                messageArgs: (cards: any) => [context.player, cards, context.player.opponent?.hand.length ?? 0],
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    targetLocation: Locations.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(context.player.opponent?.hand.length ?? 0)
                }))
            }))
        });
    }
}


export default DisdainfulRemark;
