import { reduceNextPlayedCardCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class MatsuTsuko extends DrawCard {
    static id = 'matsu-tsuko';

    override setupCardAbilities() {
        this.action('Reduce the cost of the next card')
            .condition((context) => context.source.isAttacking())
            .ifCondition((context) => context.player.isMoreHonorable())
            .playerLastingEffect({
                effect: reduceNextPlayedCardCost(2)
            })
            .chatText('reduce the cost of their next card played this conflict by 2');
    }
}
