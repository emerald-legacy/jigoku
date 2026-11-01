import { TargetMode, CardType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import * as costs from '../../costs/index.js';
import { dishonor } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import { countTargetable } from '../countTargetable.js';

export default class DishonorableAssault extends ProvinceCard {
    static id = 'dishonorable-assault';

    override setupCardAbilities() {
        this.action('Discard cards to dishonor attackers')
            .cost(costs.discardCardsUpToVariableX((context) => this.getNumberOfLegalTargets(context)))
            .targetCards({
                mode: TargetMode.ExactlyVariable,
                numCardsFunc: (context) => context.costs.discardCardsUpToVariableX?.length ?? this.getNumberOfLegalTargets(context),
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, dishonor())
            .chatText((context) => msg`discard ${context.costs.discardCardsUpToVariableX} and dishonor ${context.targets.target}`)
            .cannotTargetFirst();
    }

    private getNumberOfLegalTargets(context: AbilityContext) {
        if(!this.game.currentConflict) {
            return 0;
        }
        return countTargetable(this.game.currentConflict.getParticipants((card) => card.isAttacking() && dishonor().canAffect(card, context)), context);
    }
}
