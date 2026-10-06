import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { discardStatusToken, multipleContext, selectToken } from '../../GameActions/GameActions.js';
import { TargetMode, CardType } from '../../Constants.js';
import { countTargetable } from '../countTargetable.js';

class ImbuedWithShadows extends DrawCard {
    static id = 'imbued-with-shadows';

    setupCardAbilities() {
        this.action('Lose honor to discard status tokens')
            .cost(AbilityDsl.costs.variableHonorCost((context) => this.getNumberOfLegalTargets(context)))
            .targetCards({
                mode: TargetMode.ExactlyVariable,
                numCardsFunc: (context) => context.costs.variableHonorCost || this.getNumberOfLegalTargets(context),
                cardType: CardType.Character
            }, multipleContext((context) => {
                const targets = Object.values(context.targets).flat();
                return {
                    gameActions: this.getStatusTokenPrompts(targets)
                };
            }))
            .effect('lose {1} honor to discard status tokens from {2}', (context) => [context.costs.variableHonorCost, context.targets.target])
            .cannotTargetFirst();
    }

    private getStatusTokenPrompts(targets: BaseCard[]) {
        return targets.map((target) => selectToken(() => ({
            card: target,
            activePromptTitle: `Which token do you wish to discard from ${target.name}?`,
            message: '{0} discards {1} from {2}',
            messageArgs: (token, player) => [player, token, target],
            gameAction: discardStatusToken()
        })));
    }

    private getNumberOfLegalTargets(context: AbilityContext) {
        return countTargetable(context.game.findAnyCardsInPlay((card) => card.isHonored || card.isDishonored), context);
    }
}


export default ImbuedWithShadows;
