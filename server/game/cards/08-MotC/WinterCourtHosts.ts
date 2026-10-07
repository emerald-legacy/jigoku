import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { draw } from '../../GameActions/GameActions.js';

class WinterCourtHosts extends DrawCard {
    static id = 'winter-court-hosts';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onCardPlayed: (event, context) => {
                    return event.player === context.player.opponent &&
                        context.source.isParticipating() &&
                        context.player.isMoreHonorable();
                }
            })
            .gameAction(draw())
            .limit(unlimitedPerConflict());
    }
}

export default WinterCourtHosts;

