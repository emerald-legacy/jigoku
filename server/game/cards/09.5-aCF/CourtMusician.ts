import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

import { Durations, Players } from '../../Constants.js';

class CourtMusician extends DrawCard {
    static id = 'court-musician';

    setupCardAbilities() {
        this.action({
            title: 'Decrease cost to play cards',
            condition: context => context.source.isParticipating(),
            effect: 'decrease the cost of cards played by 1 for each player\'s next action opportunity',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                targetController: Players.Any,
                duration: Durations.UntilNextPassPriority,
                effect: AbilityDsl.effects.reduceCost({
                    amount: 1
                })
            })
        });
    }
}


export default CourtMusician;

