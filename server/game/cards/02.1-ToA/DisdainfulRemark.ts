import DrawCard from '../../drawcard';
import { Locations, CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

class DisdainfulRemark extends DrawCard {
    static id = 'disdainful-remark';

    setupCardAbilities() {
        this.action({
            title: 'Add Province Strength',
            condition: context => context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')) &&
                                  context.player.opponent && context.player.opponent.hand.length > 0,
            effect: 'increase the strength of an attacked province',
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.isConflictProvince(),
                message: '{0} increases the strength of {1} by {2}',
                messageArgs: cards => [context.player, cards, context.player.opponent.hand.length],
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    targetLocation: Locations.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(context.player.opponent.hand.length)
                }))
            }))
        });
    }
}


export default DisdainfulRemark;
