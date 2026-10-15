import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { modifyBothSkills } from '../../effects.js';
import { Location } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class SharpenTheMind extends DrawCard {
    static id = 'sharpen-the-mind';

    override setupCardAbilities() {
        this.action('Give +3/+3 to attached character')
            .condition((context) => context.game.isDuringConflict())
            .cost(costs.discardCard({ location: Location.Hand }))
            .cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: modifyBothSkills(3)
            }))
            .chatText((context) => msg`give +3${'military'}/+3${'political'} to ${context.source.parentCharacter}`);
    }
}


export default SharpenTheMind;
