import DrawCard from '../../DrawCard.js';
import { AbilityType, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { gainAbility } from '../../effects.js';
import { dishonor } from '../../GameActions/GameActions.js';

class YogoParamour extends DrawCard {
    static id = 'yogo-paramour';

    setupCardAbilities() {
        this.dire({
            effect: gainAbility(AbilityType.Action, {
                title: 'Dishonor any character',
                cost: AbilityDsl.costs.bowSelf(),
                target: {
                    cardType: CardType.Character,
                    gameAction: dishonor()
                }
            })
        });
    }
}


export default YogoParamour;
