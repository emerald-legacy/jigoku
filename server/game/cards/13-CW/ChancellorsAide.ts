import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, TargetMode } from '../../Constants.js';

class ChancellorsAide extends DrawCard {
    static id = 'chancellor-s-aide';

    setupCardAbilities() {
        this.interrupt({
            title: 'Player discards a card',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            cost: AbilityDsl.costs.optionalHonorTransferFromOpponentCost(),
            targets: {
                myPlayer: {
                    mode: TargetMode.Select,
                    targets: true,
                    choices: {
                        [this.owner.name]: AbilityDsl.actions.chosenDiscard(({ target: this.owner })),
                        [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.chosenDiscard(({ target: this.owner.opponent }))
                    }
                },
                oppPlayer: {
                    mode: TargetMode.Select,
                    targets: true,
                    player: Players.Opponent,
                    condition: context => !!context.costs.optionalHonorTransferFromOpponentCostPaid,
                    choices: {
                        [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.chosenDiscard(({ target: this.owner.opponent })),
                        [this.owner.name]: AbilityDsl.actions.chosenDiscard(({ target: this.owner }))
                    }
                }
            },
            cannotTargetFirst: true
        });
    }
}


export default ChancellorsAide;
