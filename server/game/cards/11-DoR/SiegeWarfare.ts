import DrawCard from '../../DrawCard.js';
import { Locations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SiegeWarfare extends DrawCard {
    static id = 'siege-warfare';

    setupCardAbilities() {
        this.action({
            title: 'Give attacked province -2 strength',
            condition: context => context.player.isAttackingPlayer() && context.player.getNumberOfHoldingsInPlay() > 0,
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.isConflictProvince() && card.getStrength() > 0,
                message: '{0} reduces the strength of {1} by 2',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    targetLocation: Locations.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(-2)
                }))
            })),
            effect: 'reduce the province strength of an attacked province by 2'
        });
    }
}


export default SiegeWarfare;
