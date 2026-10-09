import { setMaxConflicts } from '../../effects.js';
import { Duration } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

export default class PrivilegedPosition extends DrawCard {
    static id = 'privileged-position';

    public setupCardAbilities() {
        this.reaction('Your opponent may only declare 1 conflict opportunity this turn')
            .when({
                onHonorDialsRevealed: (event, context) =>
                    event.isHonorBid &&
                    context.player.opponent !== undefined &&
                    context.player.honorBid < context.player.opponent.honorBid
            })
            .playerLastingEffect((context) => ({
                duration: Duration.UntilEndOfRound,
                targetController: context.player.opponent,
                effect: setMaxConflicts(1)
            }))
            .chatText((context) => msg`limit ${context.player.opponent ?? context.player} to a single conflict this turn`);
    }
}
