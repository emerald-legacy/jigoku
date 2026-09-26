import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HeroOfThreeTrees extends DrawCard {
    static id = 'hero-of-three-trees';

    setupCardAbilities() {
        this.action('Gain 1 honor or reduce the attacked province strength')
            .condition(context => !!(context.source.isParticipating()
                && context.player.opponent
                && context.player.hand.length < context.player.opponent.hand.length))
            .select('target', {

            }, {
                'Gain 1 honor': AbilityDsl.actions.gainHonor(),
                'Lower attacked province\'s strength by 1': AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    cardCondition: card => card.isConflictProvince(),
                    subActionProperties: (card: ProvinceCard) => {
                        context.target = card;
                        return ({ target: card });
                    },
                    message: '{0} reduces the strength of {1} by 1',
                    messageArgs: cards => [context.player, cards],
                    gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                        effect: (
                            (context.target?.isProvinceCard() ? context.target.getStrength() : 0) > 0 ?
                                AbilityDsl.effects.modifyProvinceStrength(-1) : []
                        )
                    }))
                }))
            })
            .effect('{1}{2}', context => [context.select === 'Gain 1 honor' ? 'gain 1 honor' : 'reduce the strength of ',
                context.select === 'Gain 1 honor' ? '' : 'an attacked province by 1']);
    }
}


export default HeroOfThreeTrees;
