import DrawCard from '../../drawcard.js';
import { Locations, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CautiousScout extends DrawCard {
    static id = 'cautious-scout';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.isConflictProvince(),
            targetLocation: Locations.Provinces,
            targetController: Players.Opponent,
            condition: context => context.source.isAttacking() && context.game.currentConflict?.getNumberOfParticipantsFor('attacker') === 1,
            effect: AbilityDsl.effects.blank()
        });
    }
}


export default CautiousScout;
