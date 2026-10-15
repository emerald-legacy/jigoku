import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import { moveConflict } from '../../GameActions/GameActions.js';

class MatsuAgetoki extends DrawCard {
    static id = 'matsu-agetoki';

    setupCardAbilities() {
        this.action('Move the conflict to another eligible province')
            .condition((context) => context.player.isMoreHonorable() && context.source.isAttacking())
            .selectCard({
                cardType: CardType.Province,
                location: Location.Provinces,
                gameAction: moveConflict(),
                message: (context, card) => msg`${context.player} moves the conflict to ${card}`
            })
            .chatText('move the conflict to another eligible province');
    }
}


export default MatsuAgetoki;
