import DrawCard from '../../DrawCard.js';
import { Duration, Phases } from '../../Constants.js';
import { playerCannot } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';

class DivineAncestry extends DrawCard {
    static id = 'divine-ancestry';

    setupCardAbilities() {
        this.reaction('Prevent losing honor this phase')
            .when({
                onPhaseStarted: event => event.phase !== Phases.Setup
            })
            .gameAction(playerLastingEffect(context => ({
                duration: Duration.UntilEndOfPhase,
                targetController: context.player,
                effect: [
                    playerCannot({
                        cannot: 'loseHonor'
                    }),
                    playerCannot({
                        cannot: 'takeHonor'
                    })
                ]
            })))
            .effect('prevent {1} from losing honor this phase', context => [context.player]);
    }
}


export default DivineAncestry;
