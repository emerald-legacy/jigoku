import DrawCard from '../../DrawCard.js';
import { unlimited } from '../../AbilityLimit.js';

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
            .draw()
            .limit(unlimited());
    }
}

export default WinterCourtHosts;

