import { msg } from '../../../GameChat.js';
import { CardType, Duration, Players, Trait } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { modifyProvinceStrength, noUnopposedHonorLoss } from '../../../effects.js';
import { cardLastingEffect, onAffinity, playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class CastleOfAir extends DrawCard {
    static id = 'castle-of-air';

    override setupCardAbilities() {
        this.conflictAction('Add Province Strength')
            .cost(costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Shugenja)
            }))
            .selectAttackedProvince({
                message: (context, cards) => msg`${context.player} increases the strength of ${cards}`,
                gameAction: cardLastingEffect({
                    effect: modifyProvinceStrength(4)
                })
            })
            .gameAction(onAffinity({
                trait: Trait.Air,
                chatText: () => msg`prevent unopposed honor loss`,
                gameAction: playerLastingEffect({
                    target: Players.Self,
                    duration: Duration.UntilEndOfConflict,
                    effect: noUnopposedHonorLoss()
                })
            }))
            .chatText(() => msg`increase the strength of an attacked province by 4`);
    }
}
