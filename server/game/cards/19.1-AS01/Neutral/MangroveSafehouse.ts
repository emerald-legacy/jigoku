import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class MangroveSafehouse extends DrawCard {
    static id = 'mangrove-safehouse';

    public setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Move an attacker out of the conflict',
            effect: 'move {0} home{1}',
            effectArgs: (context) => [
                this.targetIsMantis(context) && this.opponentHasFateToBeStolen(context) ? ' and steal 1 fate' : ''
            ],
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.multipleContext((context) => {
                    const gameActions: GameAction[] = [AbilityDsl.actions.sendHome()];
                    if(this.targetIsMantis(context)) {
                        gameActions.push(AbilityDsl.actions.takeFate({ target: context.player.opponent }));
                    }
                    return { gameActions };
                })
            }
        });
    }

    private targetIsMantis(context: AbilityContext<any, DrawCard>): boolean {
        return context.target?.traits.some((trait: string) => trait === 'mantis-clan') ?? false;
    }

    private opponentHasFateToBeStolen(context: AbilityContext): boolean {
        return (context.player.opponent?.fate ?? 0) > 0;
    }
}
