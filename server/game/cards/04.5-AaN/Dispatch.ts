import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { conditional, moveToConflict, sendHome } from '../../GameActions/GameActions.js';

class Dispatch extends DrawCard {
    static id = 'dispatch';

    setupCardAbilities() {
        this.action('Move a character into or out of the conflict')
            .selectCard({
                cardType: CardType.Character,
                cardCondition: (card) => card.isFaction('unicorn'),
                controller: Players.Self,
                gameAction: conditional({
                    condition: (_context, properties) => {
                        const target = properties.target;
                        if(!target || !Array.isArray(target)) {
                            return false;
                        }
                        const first = target[0];
                        return first instanceof DrawCard && first.inConflict;
                    },
                    trueGameAction: sendHome(),
                    falseGameAction: moveToConflict()
                }),
                message: (_context, card, player) => msg`${player} chooses to ${card.inConflict ? 'send' : 'move'} ${card} ${card.inConflict ? 'home' : 'into the conflict'}`})
            .chatText('choose a unicorn character they control to move into a conflict or home');
    }
}


export default Dispatch;
