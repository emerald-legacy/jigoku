import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CommandRespect extends DrawCard {
    static id = 'command-respect';

    setupCardAbilities() {
        this.action({
            title: 'Take honor from opponent when they play an event',
            condition: context => context.game.isDuringConflict() && context.player.opponent &&
                context.player.hand.length < context.player.opponent.hand.length,
            max: AbilityDsl.limit.perConflict(1),
            effect: 'force {1} to give them an honor as an additional cost to play an event until the end of the conflict',
            effectArgs: context => [context.player.opponent as any],
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player.opponent,
                effect: AbilityDsl.effects.additionalPlayCost((sourceContext: any) =>
                    sourceContext.source.type === CardTypes.Event ? [AbilityDsl.costs.giveHonorToOpponent(1)] : []
                )
            }))
        });
    }
}


export default CommandRespect;
