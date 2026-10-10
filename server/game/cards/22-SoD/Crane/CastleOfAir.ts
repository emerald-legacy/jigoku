import { msg } from '../../../GameChat.js';
import { CardType, Duration, Location } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { modifyProvinceStrength, noUnopposedHonorLoss } from '../../../effects.js';
import { cardLastingEffect, selectCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class CastleOfAir extends DrawCard {
    static id = 'castle-of-air';

    setupCardAbilities() {
        this.action('Add Province Strength')
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('shugenja')
            }))
            .condition((context) => context.game.isDuringConflict())
            .gameAction(selectCard({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: (context, cards) => msg`${context.player} increases the strength of ${cards}`,
                gameAction: cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(4)
                })
            }))
            .if((context) => context.player.hasAffinity('air', context))
            .playerLastingEffect((context) => ({
                target: context.player,
                duration: Duration.UntilEndOfConflict,
                effect: noUnopposedHonorLoss()
            }))
            .chatText((context) => context.player.hasAffinity('air', context)
                ? msg`increase the strength of an attacked province by 4${' and prevent unopposed honor loss'}`
                : msg`increase the strength of an attacked province by 4`);
    }
}
