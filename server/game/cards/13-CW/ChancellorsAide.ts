import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players } from '../../Constants.js';

class ChancellorsAide extends DrawCard {
    static id = 'chancellor-s-aide';

    setupCardAbilities() {
        this.interrupt('Player discards a card')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .cost(AbilityDsl.costs.optionalHonorTransferFromOpponentCost())
            .select('myPlayer', {
                targets: true
            }, {
                [this.owner.name]: AbilityDsl.actions.chosenDiscard(({ target: this.owner })),
                [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.chosenDiscard(({ target: this.owner.opponent }))
            })
            .select('oppPlayer', {
                targets: true,
                player: Players.Opponent,
                condition: context => !!context.costs.optionalHonorTransferFromOpponentCostPaid
            }, {
                [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.chosenDiscard(({ target: this.owner.opponent })),
                [this.owner.name]: AbilityDsl.actions.chosenDiscard(({ target: this.owner }))
            })
            .cannotTargetFirst();
    }
}


export default ChancellorsAide;
