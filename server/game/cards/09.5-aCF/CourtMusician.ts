import DrawCard from '../../DrawCard.js';
import { reduceCost } from '../../effects.js';

import { Duration, Players } from '../../Constants.js';

class CourtMusician extends DrawCard {
    static id = 'court-musician';

    setupCardAbilities() {
        this.action('Decrease cost to play cards')
            .condition(context => context.source.isParticipating())
            .playerLastingEffect({
                targetController: Players.Any,
                duration: Duration.UntilNextPassPriority,
                effect: reduceCost({
                    amount: 1
                })
            })
            .chatText('decrease the cost of cards played by 1 for each player\'s next action opportunity');
    }
}


export default CourtMusician;

