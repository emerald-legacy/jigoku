import DrawCard from '../../DrawCard.js';
import { Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CautiousScout extends DrawCard {
    static id = 'cautious-scout';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.isConflictProvince(),
            targetLocation: Location.Provinces,
            targetController: Players.Opponent,
            condition: context => context.source.isAttacking() && context.game.currentConflict?.getNumberOfParticipantsFor('attacker') === 1,
            effect: AbilityDsl.effects.blank()
        });
    }
}


export default CautiousScout;
