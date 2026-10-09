import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';
import { additionalPlayCost } from '../../effects.js';

class CommandRespect extends DrawCard {
    static id = 'command-respect';

    setupCardAbilities() {
        this.action('Take honor from opponent when they play an event')
            .condition((context) => !!(context.game.isDuringConflict() && context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length))
            .playerLastingEffect((context) => ({
                targetController: context.player.opponent,
                effect: additionalPlayCost((sourceContext) =>
                    sourceContext.source.type === CardType.Event ? [costs.giveHonorToOpponent(1)] : []
                )
            }))
            .chatText((context) => msg`force ${context.player.opponent} to give them an honor as an additional cost to play an event until the end of the conflict`)
            .max(perConflict(1));
    }
}


export default CommandRespect;
