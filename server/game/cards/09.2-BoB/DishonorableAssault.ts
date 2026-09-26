import { TargetMode, CardType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class DishonorableAssault extends ProvinceCard {
    static id = 'dishonorable-assault';

    setupCardAbilities() {
        this.action('Discard cards to dishonor attackers')
            .cost(AbilityDsl.costs.discardCardsUpToVariableX((context) => this.getNumberOfLegalTargets(context)))
            .targetCards('target', {
                mode: TargetMode.ExactlyVariable,
                numCardsFunc: (context) => {
                    if(context && context.costs && context.costs.discardCardsUpToVariableX) {
                        return context.costs.discardCardsUpToVariableX.length;
                    }

                    return this.getNumberOfLegalTargets(context);
                },
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, AbilityDsl.actions.dishonor())
            .effect('discard {1} and dishonor {2}', (context) => [context.costs.discardCardsUpToVariableX, context.targets.target])
            .cannotTargetFirst();
    }

    getNumberOfLegalTargets(context: AbilityContext) {
        if(this.game.isDuringConflict() && this.game.currentConflict) {
            let cards = this.game.currentConflict.getParticipants((card) => card.isAttacking());
            let count = 0;
            cards.forEach((card) => {
                if(card.allowGameAction('dishonor', context)) {
                    count++;
                }
            });

            return count;
        }
        return 0;
    }
}
