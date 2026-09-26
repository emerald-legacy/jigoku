import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class MatsuTsuko extends DrawCard {
    static id = 'matsu-tsuko';

    setupCardAbilities() {
        this.action('Reduce the cost of the next card')
            .condition((context) =>
                !!(context.source.isAttacking() && context.player.opponent && context.player.isMoreHonorable()))
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(2)
            })))
            .effect('reduce the cost of their next card played this conflict by 2');
    }
}
