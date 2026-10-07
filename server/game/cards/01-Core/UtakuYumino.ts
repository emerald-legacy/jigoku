import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyBothSkills } from '../../effects.js';

class UtakuYumino extends DrawCard {
    static id = 'utaku-yumino';

    setupCardAbilities() {
        this.action('Discard a card for +2/+2')
            .cost(AbilityDsl.costs.discardCard({ location: Location.Hand }))
            .condition(() => this.game.isDuringConflict())
            .cardLastingEffect({ effect: modifyBothSkills(2) })
            .effect('give {0} +2/+2')
            .limit(AbilityDsl.limit.perConflict(1));
    }
}


export default UtakuYumino;
