import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class UtakuYumino extends DrawCard {
    static id = 'utaku-yumino';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Discard a card for +2/+2')
            .cost(ability.costs.discardCard({ location: Location.Hand }))
            .condition(() => this.game.isDuringConflict())
            .gameAction(ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(2) }))
            .effect('give {0} +2/+2')
            .limit(ability.limit.perConflict(1));
    }
}


export default UtakuYumino;
