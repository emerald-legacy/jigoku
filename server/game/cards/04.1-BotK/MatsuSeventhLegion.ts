import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';

class MatsuSeventhLegion extends DrawCard {
    static id = 'matsu-seventh-legion';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: (card: DrawCard) => card.hasTrait('courtier'),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.cannotBeDeclaredAsDefender()});
    }
}

export default MatsuSeventhLegion;
