import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FuSuiTemple extends DrawCard {
    static id = 'fu-sui-temple';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            condition: context => context.game.isDuringConflict('political'),
            match: card => card.isParticipating(),
            effect: AbilityDsl.effects.addKeyword('pride')
        });
    }
}


export default FuSuiTemple;
