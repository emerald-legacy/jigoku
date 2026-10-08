import DrawCard from '../../DrawCard.js';
import { Duration, Phase } from '../../Constants.js';
import { playerCannot } from '../../effects.js';
import { msg } from '../../GameChat.js';

class DivineAncestry extends DrawCard {
    static id = 'divine-ancestry';

    setupCardAbilities() {
        this.reaction('Prevent losing honor this phase')
            .when({
                onPhaseStarted: (event) => event.phase !== Phase.Setup
            })
            .playerLastingEffect((context) => ({
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
            }))
            .chatText((context) => msg`prevent ${context.player} from losing honor this phase`);
    }
}


export default DivineAncestry;
