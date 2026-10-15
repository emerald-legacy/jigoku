import { cannotBeDeclaredAsDefender } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Players, Trait } from '../../Constants.js';

class MatsuSeventhLegion extends DrawCard {
    static id = 'matsu-seventh-legion';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            match: (card) => card.hasTrait(Trait.Courtier),
            targetController: Players.Opponent,
            effect: cannotBeDeclaredAsDefender()});
    }
}

export default MatsuSeventhLegion;
