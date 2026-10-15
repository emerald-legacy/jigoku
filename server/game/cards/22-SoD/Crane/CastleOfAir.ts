import { msg } from '../../../GameChat.js';
import { CardType, Duration, Players } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { modifyProvinceStrength, noUnopposedHonorLoss } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class CastleOfAir extends DrawCard {
    static id = 'castle-of-air';

    setupCardAbilities() {
        this.action('Add Province Strength')
            .condition((context) => context.game.isDuringConflict())
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('shugenja')
            }))
            .selectAttackedProvince({
                message: (context, cards) => msg`${context.player} increases the strength of ${cards}`,
                gameAction: cardLastingEffect({
                    effect: modifyProvinceStrength(4)
                })
            })
            .if((context) => context.player.hasAffinity('air', context))
            .playerLastingEffect({
                target: Players.Self,
                duration: Duration.UntilEndOfConflict,
                effect: noUnopposedHonorLoss()
            })
            .chatText((context) => context.player.hasAffinity('air', context)
                ? msg`increase the strength of an attacked province by 4${' and prevent unopposed honor loss'}`
                : msg`increase the strength of an attacked province by 4`);
    }
}
