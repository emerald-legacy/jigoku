import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect, gainHonor, selectAttackedProvince } from '../../GameActions/GameActions.js';

class HeroOfThreeTrees extends DrawCard {
    static id = 'hero-of-three-trees';

    override setupCardAbilities() {
        this.action('Gain 1 honor or reduce the attacked province strength')
            .condition((context) => !!(context.source.isParticipating()
                && context.player.opponent
                && context.player.hand.length < context.player.opponent.hand.length))
            .select({
                'Gain 1 honor': {
                    action: gainHonor(),
                    chatText: 'gain 1 honor'
                },
                'Lower attacked province\'s strength by 1': {
                    action: selectAttackedProvince({
                        message: (context, cards) => msg`${context.player} reduces the strength of ${cards} by 1`,
                        gameAction: (province) => cardLastingEffect(() => ({
                            effect: province.getStrength() > 0 ? modifyProvinceStrength(-1) : []
                        }))
                    }),
                    chatText: 'reduce the strength of an attacked province by 1'
                }
            });
    }
}


export default HeroOfThreeTrees;
