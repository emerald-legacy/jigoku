import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetModes, CardTypes } from '../../Constants.js';

class ImbuedWithShadows extends DrawCard {
    static id = 'imbued-with-shadows';

    setupCardAbilities() {
        this.action({
            title: 'Lose honor to discard status tokens',
            effect: 'lose {1} honor to discard status tokens from {2}',
            effectArgs: (context) => [context.costs.variableHonorCost as number, context.targets.target as BaseCard[]],
            cost: AbilityDsl.costs.variableHonorCost((context) => this.getNumberOfLegalTargets(context)),
            target: {
                mode: TargetModes.ExactlyVariable,
                numCardsFunc: (context) => {
                    if(context && context.costs && context.costs.variableHonorCost) {
                        return context.costs.variableHonorCost as number;
                    }

                    return this.getNumberOfLegalTargets(context);
                },
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.multipleContext((context) => {
                    let targets = Object.values(context.targets).flat();
                    targets = targets.concat(Object.values(context.selects).flat());
                    return {
                        gameActions: this.getStatusTokenPrompts(targets as BaseCard[])
                    };
                })
            },
            cannotTargetFirst: true
        });
    }

    getStatusTokenPrompts(targets: BaseCard[]) {
        let actions: any[] = [];
        targets.forEach((target: BaseCard) => {
            actions.push(
                AbilityDsl.actions.selectToken(() => ({
                    card: target,
                    activePromptTitle: `Which token do you wish to discard from ${target.name}?`,
                    message: '{0} discards {1} from {2}',
                    messageArgs: (token: any, player: any) => [player, token, target],
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
