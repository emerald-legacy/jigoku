import DrawCard from '../../DrawCard.js';
import { AbilityType, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { gainAbility } from '../../effects.js';
import { dishonor } from '../../GameActions/GameActions.js';

class YogoParamour extends DrawCard {
    static id = 'yogo-paramour';

    setupCardAbilities() {
        this.dire({
            effect: gainAbility(AbilityType.Action, {
                title: 'Dishonor any character',
                cost: costs.bowSelf(),
                target: {
                    cardType: CardType.Character,
                    gameAction: dishonor()
                }
            })
        });
    }
}


export default YogoParamour;
