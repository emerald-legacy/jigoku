import DrawCard from '../../drawcard.js';
import { AbilityTypes, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class YogoParamour extends DrawCard {
    static id = 'yogo-paramour';

    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Dishonor any character',
                cost: AbilityDsl.costs.bowSelf(),
                target: {
                    cardType: CardTypes.Character,
                    gameAction: AbilityDsl.actions.dishonor()
                }
            })
        });
    }
}


export default YogoParamour;
