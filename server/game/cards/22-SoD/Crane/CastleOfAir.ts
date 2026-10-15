import { msg } from '../../../GameChat.js';
import { CardType, Duration, Players, Element } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { modifyProvinceStrength, noUnopposedHonorLoss } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class CastleOfAir extends DrawCard {
    static id = 'castle-of-air';

    setupCardAbilities() {
        this.conflictAction('Add Province Strength')
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
            .chatText(() => msg`increase the strength of an attacked province by 4`)
            .afterwards()
            .onAffinity(Element.Air, { chatText: () => msg`prevent unopposed honor loss` })
            .playerLastingEffect({
                target: Players.Self,
                duration: Duration.UntilEndOfConflict,
                effect: noUnopposedHonorLoss()
            });
    }
}
