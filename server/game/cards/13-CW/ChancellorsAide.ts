import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { chosenDiscard } from '../../GameActions/GameActions.js';
import { Players } from '../../Constants.js';
import { playerChoices } from '../playerChoices.js';

class ChancellorsAide extends DrawCard {
    static id = 'chancellor-s-aide';

    setupCardAbilities() {
        this.interrupt('Player discards a card')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .cost(AbilityDsl.costs.optionalHonorTransferFromOpponentCost())
            .selectFrom({
                name: 'myPlayer',
                targets: true
            }, (context) => playerChoices(context.player, (player) => chosenDiscard({ target: player })))
            .selectFrom({
                name: 'oppPlayer',
                targets: true,
                player: Players.Opponent,
                condition: context => !!context.costs.optionalHonorTransferFromOpponentCostPaid
            }, (context) => context.player.opponent ? playerChoices(context.player.opponent, (player) => chosenDiscard({ target: player })) : {})
            .cannotTargetFirst();
    }
}


export default ChancellorsAide;
