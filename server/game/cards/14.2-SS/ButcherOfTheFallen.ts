import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ButcherOfTheFallen extends DrawCard {
    static id = 'butcher-of-the-fallen';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: (card: any, context: any) => card.getMilitarySkill() < (context?.player.getProvinces((a: any) => !a.isBroken).length ?? 0),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.cardCannot('declareAsDefender')});
    }
}

export default ButcherOfTheFallen;
