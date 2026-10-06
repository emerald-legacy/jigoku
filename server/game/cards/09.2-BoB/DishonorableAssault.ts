import { TargetMode, CardType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { dishonor } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class DishonorableAssault extends ProvinceCard {
    static id = 'dishonorable-assault';

    setupCardAbilities() {
        this.action('Discard cards to dishonor attackers')
            .cost(AbilityDsl.costs.discardCardsUpToVariableX((context) => this.getNumberOfLegalTargets(context)))
            .targetCards({
                mode: TargetMode.ExactlyVariable,
                numCardsFunc: (context) => context.costs.discardCardsUpToVariableX?.length ?? this.getNumberOfLegalTargets(context),
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, dishonor())
            .effect((context) => msg`discard ${context.costs.discardCardsUpToVariableX} and dishonor ${context.targets.target}`)
            .cannotTargetFirst();
    }

    private getNumberOfLegalTargets(context: AbilityContext) {
        if(!this.game.currentConflict) {
            return 0;
        }
        return this.game.currentConflict.getParticipants((card) => card.isAttacking())
            .filter((card) => card.allowGameAction('dishonor', context)).length;
    }
}
