import DrawCard from '../../DrawCard.js';
import { Players, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ContestedCountryside extends DrawCard {
    static id = 'contested-countryside';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.isConflictProvince(),
            targetLocation: Location.Provinces,
            condition: context => context.player.isAttackingPlayer(),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.canBeTriggeredByOpponent()
        });
    }
}


export default ContestedCountryside;
