import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import { cannotBeDeclaredAsDefender } from '../../effects.js';

class ButcherOfTheFallen extends DrawCard {
    static id = 'butcher-of-the-fallen';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            match: (card, context) => card.militarySkill < (context?.player.getProvinces((a) => !a.isBroken).length ?? 0),
            targetController: Players.Opponent,
            effect: cannotBeDeclaredAsDefender()});
    }
}

export default ButcherOfTheFallen;
