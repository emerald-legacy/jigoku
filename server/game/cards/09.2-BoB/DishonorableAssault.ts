import { TargetModes, CardTypes } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type BaseCard from '../../BaseCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class DishonorableAssault extends ProvinceCard {
    static id = 'dishonorable-assault';

    setupCardAbilities() {
        this.action({
            title: 'Discard cards to dishonor attackers',
            effect: 'discard {1} and dishonor {2}',
            effectArgs: (context) => [context.costs.discardCardsUpToVariableX as BaseCard[], context.targets.target as BaseCard[]],
            cost: AbilityDsl.costs.discardCardsUpToVariableX((context) => this.getNumberOfLegalTargets(context)),
            target: {
                mode: TargetModes.ExactlyVariable,
                numCardsFunc: (context) => {
                    if(context && context.costs && context.costs.discardCardsUpToVariableX) {
                        return (context.costs.discardCardsUpToVariableX as BaseCard[]).length;
                    }

                    return this.getNumberOfLegalTargets(context);
                },
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.dishonor()
            },
            cannotTargetFirst: true
        });
    }

    getNumberOfLegalTargets(context: AbilityContext) {
        if(this.game.isDuringConflict() && this.game.currentConflict) {
            let cards = this.game.currentConflict.getParticipants((card: any) => card.isAttacking());
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
