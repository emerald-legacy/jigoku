import { msg } from '../../../GameChat.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { bow, cardLastingEffect } from '../../../GameActions/GameActions.js';

export default class CollapsibleTunnels extends DrawCard {
    static id = 'collapsible-tunnels';

    override setupCardAbilities() {
        this.conflictAction('Add Province Strength')
            .selectAttackedProvince({
                message: (context, cards) => msg`${context.player} increases the strength of ${cards}`,
                gameAction: cardLastingEffect({
                    effect: modifyProvinceStrength(2)
                })
            })
            .chatText('increase the strength of an attacked province by 2');

        this.action('Bow a character')
            .condition((context) => context.game.isDuringConflict())
            .cost(costs.sacrificeSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking() && card.getBaseMilitarySkill() <= 2
            }, bow());
    }
}
