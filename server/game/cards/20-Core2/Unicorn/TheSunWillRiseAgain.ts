import { msg } from '../../../GameChat.js';
import { Duration } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { additionalConflict } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class TheSunWillRiseAgain extends DrawCard {
    static id = 'the-sun-will-rise-again';

    setupCardAbilities() {
        this.reaction('Gain an additional conflict')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.attackingPlayer === context.player &&
                    event.conflict.winner === context.player.opponent &&
                    (event.conflict.skillDifference ?? 0) >= 4
            })
            .playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(context.event.conflict.conflictType)
            }))
            .chatText((context) => msg`gain an additional ${context.event.conflict.conflictType} conflict this round. They will not forget this defeat`)
            .max(perConflict(1));
    }
}
