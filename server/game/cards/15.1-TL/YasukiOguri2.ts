import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

class YasukiOguri2 extends DrawCard {
    static id = 'yasuki-oguri-2';

    setupCardAbilities() {
        this.action('Move a character in')
            .cost(costs.payFate(1))
            .condition(context => context.source.isDefending())
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.getFate() > 0
            }, moveToConflict());
    }
}


export default YasukiOguri2;
