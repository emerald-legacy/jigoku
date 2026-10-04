import DrawCard from '../../DrawCard.js';
import { Players, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FuSuiTemple extends DrawCard {
    static id = 'fu-sui-temple';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            condition: context => context.game.isDuringConflict(ConflictType.Political),
            match: (card) => card.isParticipating(),
            effect: AbilityDsl.effects.addKeyword('pride')
        });
    }
}


export default FuSuiTemple;
