import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class SiegeWarfare extends DrawCard {
    static id = 'siege-warfare';

    override setupCardAbilities() {
        this.action('Give attacked province -2 strength')
            .condition((context) => context.player.isAttackingPlayer())
            .ifCondition((context) => context.player.getNumberOfHoldingsInPlay() > 0)
            .selectAttackedProvince({
                cardCondition: (card) => card.getStrength() > 0,
                message: (context, cards) => msg`${context.player} reduces the strength of ${cards} by 2`,
                gameAction: cardLastingEffect(() => ({
                    effect: modifyProvinceStrength(-2)
                }))
            })
            .chatText('reduce the province strength of an attacked province by 2');
    }
}


export default SiegeWarfare;
