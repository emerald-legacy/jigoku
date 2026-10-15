import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { defendersChosenFirstDuringConflict } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class SevenStingsKeep extends StrongholdCard {
    static id = 'seven-stings-keep';

    override setupCardAbilities() {
        this.interrupt('Force defenders to assign first')
            .when({
                onConflictOpportunityAvailable: (event, context) => event.player === context.player
            })
            .cost(costs.bowSelf())
            .chooseAmount((context) => ({
                activePromptTitle: 'Choose how many characters will be attacking',
                max: context.event.attackerMatrix?.maximumNumberOfAttackers ?? 0,
                gameAction: (amount) => playerLastingEffect({ effect: defendersChosenFirstDuringConflict(amount) }),
                message: (context, amount) => msg`${context.player} will attack with ${amount} character${amount === 1 ? '' : 's'}`
            }))
            .chatText((context) => msg`force ${context.player.opponent} to declare defenders before attackers are chosen this conflict`);
    }
}
