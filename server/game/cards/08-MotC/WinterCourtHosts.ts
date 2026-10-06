import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
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
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}

export default WinterCourtHosts;

