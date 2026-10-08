import { reduceNextPlayedCardCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class MatsuTsuko extends DrawCard {
    static id = 'matsu-tsuko';

    setupCardAbilities() {
        this.action('Reduce the cost of the next card')
            .condition((context) => context.source.isAttacking() && context.player.isMoreHonorable())
            .playerLastingEffect((context) => ({
                targetController: context.player,
                effect: reduceNextPlayedCardCost(2)
            }))
            .chatText('reduce the cost of their next card played this conflict by 2');
    }
}
