import { reduceNextPlayedCardCost } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class MatsuTsuko extends DrawCard {
    static id = 'matsu-tsuko';

    setupCardAbilities() {
        this.action('Reduce the cost of the next card')
            .condition((context) => context.source.isAttacking() && context.player.isMoreHonorable())
            .gameAction(playerLastingEffect((context) => ({
                targetController: context.player,
                effect: reduceNextPlayedCardCost(2)
            })))
            .effect('reduce the cost of their next card played this conflict by 2');
    }
}
