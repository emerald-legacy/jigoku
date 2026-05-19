import DrawCard from '../../drawcard.js';
import { Players, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ContestedCountryside extends DrawCard {
    static id = 'contested-countryside';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.isConflictProvince(),
            targetLocation: Locations.Provinces,
            condition: context => context.player.isAttackingPlayer(),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.canBeTriggeredByOpponent()
        });
    }
}


export default ContestedCountryside;
