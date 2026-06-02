import DrawCard from '../../DrawCard.js';
import { AbilityType, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class YogoParamour extends DrawCard {
    static id = 'yogo-paramour';

    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Dishonor any character',
                cost: AbilityDsl.costs.bowSelf(),
                target: {
                    cardType: CardType.Character,
                    gameAction: AbilityDsl.actions.dishonor()
                }
            })
        });
    }
}


export default YogoParamour;
