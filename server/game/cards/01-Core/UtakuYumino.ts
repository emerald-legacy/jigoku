import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';
import { modifyBothSkills } from '../../effects.js';

class UtakuYumino extends DrawCard {
    static id = 'utaku-yumino';

    override setupCardAbilities() {
        this.action('Discard a card for +2/+2')
            .condition(() => this.game.isDuringConflict())
            .cost(costs.discardCard({ location: Location.Hand }))
            .cardLastingEffect({ effect: modifyBothSkills(2) })
            .chatText('give {0} +2/+2')
            .limit(perConflict(1));
    }
}


export default UtakuYumino;
