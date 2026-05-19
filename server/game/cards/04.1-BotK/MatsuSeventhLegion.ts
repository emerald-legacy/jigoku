import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';

class MatsuSeventhLegion extends DrawCard {
    static id = 'matsu-seventh-legion';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: card => card.hasTrait('courtier'),
            targetController: Players.Opponent,
            effect: ability.effects.cardCannot('declareAsDefender')});
    }
}

export default MatsuSeventhLegion;
