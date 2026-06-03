import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DoomThrower extends DrawCard {
    static id = 'doom-thrower';

    setupCardAbilities() {
        this.action({
            title: 'Reduce Province Strength',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.sacrifice({ cardType: CardType.Character }),
            effect: 'reduce an attacked province\'s strength by {1}',
            effectArgs: context => (context.costs.sacrificeStateWhenChosen && (context.costs.sacrificeStateWhenChosen as DrawCard).getFate() > 0) ? 5 : 2,
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.isConflictProvince(),
                message: '{0} reduces the strength of {1}',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength((context.costs.sacrificeStateWhenChosen && context.costs.sacrificeStateWhenChosen.getFate() > 0) ? -5 : -2)
                })
            }))
        });
    }
}


export default DoomThrower;
