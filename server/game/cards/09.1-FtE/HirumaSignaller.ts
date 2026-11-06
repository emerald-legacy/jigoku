import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { moveToConflict, multiple, ready } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';
import { readyAndMoveMessage } from '../readyAndMoveMessage.js';

class HirumaSignaller extends DrawCard {
    static id = 'hiruma-signaller';

    override setupCardAbilities() {
        this.action('Sacrifice this card to ready and move a character to the conflict')
            .condition((context) => context.source.isDefending())
            .cost(costs.sacrificeSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, multiple([
                ready(),
                moveToConflict()
            ]))
            .chatText((context) => readyAndMoveMessage(context, context.target));
    }
}


export default HirumaSignaller;

