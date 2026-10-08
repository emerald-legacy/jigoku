import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { moveConflict } from '../../GameActions/GameActions.js';

class TalismanOfTheSun extends DrawCard {
    static id = 'talisman-of-the-sun';

    setupCardAbilities() {
        this.action('Move conflict to a different province')
            .cost(costs.bowSelf())
            .condition(context => context.player.isDefendingPlayer())
            .selectCard(context => ({
                cardType: CardType.Province,
                location: Location.Provinces,
                gameAction: moveConflict(),
                message: '{0} moves the conflict to {1}',
                messageArgs: card => [context.player, card]
            }))
            .chatText('move the conflict to another eligible province');
    }
}


export default TalismanOfTheSun;
