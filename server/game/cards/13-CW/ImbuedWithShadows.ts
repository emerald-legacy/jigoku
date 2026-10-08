import { msg } from '../../GameChat.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { discardStatusToken, multipleContext, selectToken } from '../../GameActions/GameActions.js';
import { TargetMode, CardType } from '../../Constants.js';
import { countTargetable } from '../countTargetable.js';

class ImbuedWithShadows extends DrawCard {
    static id = 'imbued-with-shadows';

    setupCardAbilities() {
        this.action('Lose honor to discard status tokens')
            .cost(costs.payVariableHonor((context) => this.getNumberOfLegalTargets(context)))
            .targetCards({
                mode: TargetMode.ExactlyVariable,
                numCardsFunc: (context) => context.costs.honorPaid || this.getNumberOfLegalTargets(context),
                cardType: CardType.Character
            }, multipleContext((context) => {
                const targets = Object.values(context.targets).flat();
                return {
                    gameActions: this.getStatusTokenPrompts(targets)
                };
            }))
            .chatText('lose {1} honor to discard status tokens from {2}', (context) => [context.costs.honorPaid, context.targets.target])
            .cannotTargetFirst();
    }

    private getStatusTokenPrompts(targets: BaseCard[]) {
        return targets.map((target) => selectToken(() => ({
            card: target,
            activePromptTitle: `Which token do you wish to discard from ${target.name}?`,
            message: (_context, token, player) => msg`${player} discards ${token} from ${target}`,
            gameAction: discardStatusToken()
        })));
    }

    private getNumberOfLegalTargets(context: AbilityContext) {
        return countTargetable(context.game.findAnyCardsInPlay((card) => card.isHonored || card.isDishonored), context);
    }
}


export default ImbuedWithShadows;
