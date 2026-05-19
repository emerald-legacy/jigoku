import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

export default class MatsuTsuko extends DrawCard {
    static id = 'matsu-tsuko';

    setupCardAbilities() {
        this.action({
            title: 'Reduce the cost of the next card',
            condition: (context) =>
                context.source.isAttacking() && context.player.opponent && context.player.isMoreHonorable(),
            effect: 'reduce the cost of their next card played this conflict by 2',
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(2)
            }))
        });
    }
}
