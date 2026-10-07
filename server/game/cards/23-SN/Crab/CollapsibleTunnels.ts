import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { bow, cardLastingEffect } from '../../../GameActions/GameActions.js';

export default class CollapsibleTunnels extends DrawCard {
    static id = 'collapsible-tunnels';

    setupCardAbilities() {
        this.conflictAction('Add Province Strength')
            .selectCard((context) => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                message: '{0} increases the strength of {1}',
                messageArgs: (cards) => [context.player, cards],
                gameAction: cardLastingEffect({
                    targetLocation: Location.Provinces,
                    effect: modifyProvinceStrength(2)
                })
            }))
            .effect('increase the strength of an attacked province by 2');

        this.action('Bow a character')
            .cost(costs.sacrificeSelf())
            .condition((context) => context.game.isDuringConflict())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking() && card.getBaseMilitarySkill() <= 2
            }, bow());
    }
}
