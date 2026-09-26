import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class RegalBearing extends DrawCard {
    static id = 'regal-bearing';

    setupCardAbilities() {
        this.action('Lower bid and draw bid difference as cards')
            .condition(context => context.game.isDuringConflict('political') &&
                !!context.player.opponent &&
                context.player.anyCardsInPlay((card) => card.isParticipating() && card.hasTrait('courtier')))
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.setHonorDial(context => ({
                    target: context.player,
                    value: 1
                })),
                AbilityDsl.actions.draw(context => ({
                    target: context.player,
                    amount: this.getHonorDialDifference(context)
                }))
            ]))
            .effect('set their bid dial to 1 and draw {1} cards.', context => this.getHonorDialDifference(context))
            .max(AbilityDsl.limit.perConflict(1));
    }

    getHonorDialDifference(context: AbilityContext) {
        if(!context.player.opponent) {
            return 0;
        }

        // Players honor bid will be one but this is calculated before dials are changed.
        return Math.abs(1 - context.player.opponent.showBid);
    }
}


export default RegalBearing;

