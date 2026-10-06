import DrawCard from '../../DrawCard.js';
import { increaseCost } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';

import { Duration, Players } from '../../Constants.js';

class GracefulGuardian extends DrawCard {
    static id = 'graceful-guardian';

    setupCardAbilities() {
        this.action('Increase cost to play cards')
            .condition(context => context.source.isParticipating())
            .gameAction(playerLastingEffect({
                targetController: Players.Any,
                duration: Duration.UntilNextPassPriority,
                effect: increaseCost({
                    amount: 1
                })
            }))
            .effect('increase the cost of cards played by 1 for each player\'s next action opportunity');
    }
}


export default GracefulGuardian;

