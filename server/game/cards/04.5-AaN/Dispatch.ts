import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { moveToConflict, sendHome } from '../../GameActions/GameActions.js';

class Dispatch extends DrawCard {
    static id = 'dispatch';

    override setupCardAbilities() {
        this.action('Move a character into or out of the conflict')
            .selectCard({
                cardType: CardType.Character,
                cardCondition: (card) => card.isFaction('unicorn'),
                controller: Players.Self,
                gameAction: (card) => card.inConflict ? sendHome() : moveToConflict(),
                message: (_context, card, player) => msg`${player} chooses to ${card.inConflict ? 'send' : 'move'} ${card} ${card.inConflict ? 'home' : 'into the conflict'}`
            })
            .chatText('choose a unicorn character they control to move into a conflict or home');
    }
}


export default Dispatch;
