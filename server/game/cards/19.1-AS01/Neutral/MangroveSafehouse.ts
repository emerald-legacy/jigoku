import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { multipleContext, sendHome, takeFate } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class MangroveSafehouse extends DrawCard {
    static id = 'mangrove-safehouse';

    public setupCardAbilities() {
        this.action('Move an attacker out of the conflict')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isAttacking()
            }, multipleContext((context) => {
                const gameActions: GameAction[] = [sendHome()];
                if(this.targetIsMantis(context)) {
                    gameActions.push(takeFate({ target: context.player.opponent }));
                }
                return { gameActions };
            }))
            .chatText((context) => msg`move ${context.chatTarget()} home${this.targetIsMantis(context) && this.opponentHasFateToBeStolen(context) ? ' and steal 1 fate' : ''}`);
    }

    private targetIsMantis(context: AbilityContext): boolean {
        return context.target?.hasTrait('mantis-clan') ?? false;
    }

    private opponentHasFateToBeStolen(context: AbilityContext): boolean {
        return (context.player.opponent?.fate ?? 0) > 0;
    }
}
