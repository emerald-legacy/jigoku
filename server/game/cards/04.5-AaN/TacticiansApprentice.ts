import { perPhase } from '../../AbilityLimit.js';
import { draw } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class TacticiansApprentice extends DrawCard {
    static id = 'tactician-s-apprentice';

    public setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onHonorDialsRevealed: (event, context) =>
                    event.isHonorBid &&
                    !!context.player.opponent &&
                    context.player.showBid < context.player.opponent.showBid
            })
            .gameAction(draw())
            .effect('draw a card')
            .limit(perPhase(1));
    }
}
