import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import { Durations, Players } from '../../Constants.js';

class GracefulGuardian extends DrawCard {
    static id = 'graceful-guardian';

    setupCardAbilities() {
        this.action({
            title: 'Increase cost to play cards',
            condition: context => context.source.isParticipating(),
            effect: 'increase the cost of cards played by 1 for each player\'s next action opportunity',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                targetController: Players.Any,
                duration: Durations.UntilNextPassPriority,
                effect: AbilityDsl.effects.increaseCost({
                    amount: 1
                })
            })
        });
    }
}


export default GracefulGuardian;

