import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { moveToConflict, multiple, ready } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';

class HirumaSignaller extends DrawCard {
    static id = 'hiruma-signaller';

    setupCardAbilities() {
        this.action('Sacrifice this card to ready and move a character to the conflict')
            .cost(costs.sacrificeSelf())
            .condition((context) => context.source.isDefending())
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, multiple([
                ready(),
                moveToConflict()
            ]))
            .chatText('ready and move {0} to the conflict');
    }
}


export default HirumaSignaller;

