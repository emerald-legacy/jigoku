import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import { moveConflict } from '../../GameActions/GameActions.js';

class ChasingTheSun extends DrawCard {
    static id = 'chasing-the-sun';

    setupCardAbilities() {
        this.action('Move the conflict to another eligible province')
            .condition((context) => context.player.isAttackingPlayer())
            .selectCard({
                cardType: CardType.Province,
                location: Location.Provinces,
                message: (_context, card, player) => msg`${player} moves the conflict to ${card}`,
                gameAction: moveConflict()
            })
            .chatText('move the conflict to another eligible province')
            .cannotBeMirrored();
    }
}


export default ChasingTheSun;
