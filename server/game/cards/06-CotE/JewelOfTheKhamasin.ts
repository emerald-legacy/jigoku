import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class JewelOfTheKhamasin extends DrawCard {
    static id = 'jewel-of-the-khamasin';

    setupCardAbilities() {
        this.action('Reduce province strength')
            .cost(costs.payHonor(1))
            .condition((context) => !!(context.source.parentCharacter && context.source.parentCharacter.isAttacking()))
            .selectCard({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince() && card.isProvinceCard() && card.getStrength() > 0,
                message: (context, cards) => msg`${context.player} reduces the strength of ${cards} by 1`,
                gameAction: cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(-1)
                }))
            })
            .chatText('reduce an attacked province strength by 1')
            .limit(unlimitedPerConflict());
    }
}


export default JewelOfTheKhamasin;
