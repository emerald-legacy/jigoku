import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect, gainHonor, selectCard } from '../../GameActions/GameActions.js';

class HeroOfThreeTrees extends DrawCard {
    static id = 'hero-of-three-trees';

    setupCardAbilities() {
        this.action('Gain 1 honor or reduce the attacked province strength')
            .condition(context => !!(context.source.isParticipating()
                && context.player.opponent
                && context.player.hand.length < context.player.opponent.hand.length))
            .select({}, {
                'Gain 1 honor': gainHonor(),
                'Lower attacked province\'s strength by 1': selectCard(context => ({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    cardCondition: card => card.isConflictProvince(),
                    subActionProperties: (card) => {
                        context.target = card;
                        return ({ target: card });
                    },
                    message: '{0} reduces the strength of {1} by 1',
                    messageArgs: cards => [context.player, cards],
                    gameAction: cardLastingEffect(() => ({
                        effect: (
                            (context.target?.isProvinceCard() ? context.target.getStrength() : 0) > 0 ?
                                modifyProvinceStrength(-1) : []
                        )
                    }))
                }))
            })
            .effect('{1}{2}', context => [context.select === 'Gain 1 honor' ? 'gain 1 honor' : 'reduce the strength of ',
                context.select === 'Gain 1 honor' ? '' : 'an attacked province by 1']);
    }
}


export default HeroOfThreeTrees;
