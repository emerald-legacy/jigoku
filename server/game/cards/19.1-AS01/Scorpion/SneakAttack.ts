import { msg } from '../../../GameChat.js';
import * as costs from '../../../costs/index.js';
import { gainActionPhasePriority } from '../../../effects.js';
import { playerLastingEffect, sequential, setAside } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { shuffle } from '../../../utils/random.js';

export default class SneakAttack extends DrawCard {
    static id = 'sneak-attack';

    public setupCardAbilities() {
        this.reaction('The attacker gets the first action opportunity')
            .when({
                onConflictStarted: (event, context) => event.conflict.attackingPlayer === context.player
            })
            .cost(costs.payHonor(1))
            .gameAction(sequential([
                setAside((context) => ({
                    target: shuffle(context.player.opponent?.hand ?? []).slice(0, 2),
                    returnAtEndOfConflict: true,
                    message: (context, cards) => msg`${context.player.opponent} sets aside ${cards}`
                })),
                playerLastingEffect((context) => ({
                    targetController: context.player,
                    effect: gainActionPhasePriority()
                }))
            ]))
            .chatText((context) => msg`give ${context.player} the first action in this conflict${(context.player.opponent?.hand.length ?? 0) > 0 ? ' and set aside opponent\'s cards' : ''}`);
    }
}
