import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type { GameAction } from '../../GameActions/GameAction.js';
import { TargetMode, CardType } from '../../Constants.js';

class ImbuedWithShadows extends DrawCard {
    static id = 'imbued-with-shadows';

    setupCardAbilities() {
        this.action('Lose honor to discard status tokens')
            .cost(AbilityDsl.costs.variableHonorCost((context) => this.getNumberOfLegalTargets(context)))
            .targetCards('target', {
                mode: TargetMode.ExactlyVariable,
                numCardsFunc: (context) => {
                    if(context && context.costs && context.costs.variableHonorCost) {
                        return context.costs.variableHonorCost;
                    }

                    return this.getNumberOfLegalTargets(context);
                },
                cardType: CardType.Character
            }, AbilityDsl.actions.multipleContext((context) => {
                const targets = Object.values(context.targets).flat();
                return {
                    gameActions: this.getStatusTokenPrompts(targets)
                };
            }))
            .effect('lose {1} honor to discard status tokens from {2}', (context) => [context.costs.variableHonorCost, context.targets.target])
            .cannotTargetFirst();
    }

    getStatusTokenPrompts(targets: BaseCard[]) {
        let actions: GameAction[] = [];
        targets.forEach((target: BaseCard) => {
            actions.push(
                AbilityDsl.actions.selectToken(() => ({
                    card: target,
                    activePromptTitle: `Which token do you wish to discard from ${target.name}?`,
                    message: '{0} discards {1} from {2}',
                    messageArgs: (token, player) => [player, token, target],
                    gameAction: AbilityDsl.actions.discardStatusToken()
                }))
            );
        });

        return actions;
    }

    getNumberOfLegalTargets(context: AbilityContext) {
        let cards = context.game.findAnyCardsInPlay((card: BaseCard) => card.isHonored || card.isDishonored);
        let selectedCards: BaseCard[] = [];
        cards.forEach((card: BaseCard) => {
            if(card.canBeTargeted(context, selectedCards)) {
                selectedCards.push(card);
            }
        });

        return selectedCards.length;
    }
}


export default ImbuedWithShadows;
