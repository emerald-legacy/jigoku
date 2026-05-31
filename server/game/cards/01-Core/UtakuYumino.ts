import DrawCard from '../../DrawCard.js';
import { Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class UtakuYumino extends DrawCard {
    static id = 'utaku-yumino';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Discard a card for +2/+2',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.discardCard({ location: Locations.Hand }),
            effect: 'give {0} +2/+2',
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(2) }),
            limit: ability.limit.perConflict(1)
        });
    }
}


export default UtakuYumino;
