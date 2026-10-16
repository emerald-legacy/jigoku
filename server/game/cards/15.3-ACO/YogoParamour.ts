import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { gainAbility } from '../../effects.js';
import { dishonor } from '../../GameActions/GameActions.js';

class YogoParamour extends DrawCard {
    static id = 'yogo-paramour';

    override setupCardAbilities() {
        this.dire({
            effect: gainAbility.action('Dishonor any character', (ability) => ability
                .cost(costs.bowSelf())
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card, context) => card !== context.source
                }, dishonor()))
        });
    }
}


export default YogoParamour;
