import { moveToConflict, ready } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { readyAndMoveMessage } from '../readyAndMoveMessage.js';

class FightOn extends DrawCard {
    static id = 'fight-on';

    override setupCardAbilities() {
        this.action('Ready character and move to conflict')
            .condition((context) => context.player.isDefendingPlayer())
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.bowed
            }, ready(), moveToConflict())
            .chatText((context) => readyAndMoveMessage(context, context.target));
    }
}


export default FightOn;
