import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';
import { delayedEffect } from '../../effects.js';
import { multiple, removeRingFromPlay, returnRingToPlay, ringLastingEffect } from '../../GameActions/GameActions.js';

class SuddenTempest extends DrawCard {
    static id = 'sudden-tempest';

    setupCardAbilities() {
        this.action('Remove a ring from the unclaimed ring pool')
            .ringTarget({
                ringCondition: ring => ring.isUnclaimed()
            }, multiple([
                removeRingFromPlay(),
                ringLastingEffect(context => ({
                    duration: Duration.Custom,
                    until: {
                        onBeginRound: () => true
                    },
                    target: context.ring?.getElements().map((element) => this.game.rings[element]),
                    effect: delayedEffect({
                        when: {
                            onRoundEnded: () => true
                        },
                        gameAction: returnRingToPlay()
                    })
                }))
            ]))
            .effect('remove the {0} from the unclaimed ring pool until the end of the round');
    }
}


export default SuddenTempest;
