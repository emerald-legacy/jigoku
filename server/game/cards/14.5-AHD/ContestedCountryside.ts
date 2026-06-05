import DrawCard from '../../DrawCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { Players, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ContestedCountryside extends DrawCard {
    static id = 'contested-countryside';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card: ProvinceCard) => card.isConflictProvince(),
            targetLocation: Location.Provinces,
            condition: context => context.player.isAttackingPlayer(),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.canBeTriggeredByOpponent()
        });
    }
}


export default ContestedCountryside;
