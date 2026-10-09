import { msg } from '../../GameChat.js';
import * as costs from '../../costs/index.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { modifyProvinceStrength } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class WrathOfTheKami extends DrawCard {
    static id = 'the-wrath-of-the-kami';

    setupCardAbilities() {
        this.action('Add Province Strength')
            .cost(costs.payHonor(1))
            .condition((context) => this.game.isDuringConflict() && context.source.isInConflictProvince())
            .cardLastingEffect((context) => ({
                target: context.source.controller.getProvinceCardInProvince(context.source.location),
                targetLocation: Location.Provinces,
                effect: modifyProvinceStrength(1)
            }))
            .chatText((context) => msg`add 1 to the province strength of ${context.source.controller.getProvinceCardInProvince(context.source.location)}`)
            .limit(unlimitedPerConflict());
    }
}


export default WrathOfTheKami;
