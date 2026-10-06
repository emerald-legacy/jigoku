import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { switchConflictType } from '../../GameActions/GameActions.js';
import { ConflictType } from '../../Constants.js';

class CaptiveAudience extends DrawCard {
    static id = 'captive-audience';

    setupCardAbilities() {
        this.action('Change the conflict to military')
            .cost(AbilityDsl.costs.payHonor(1))
            .condition(() => this.game.isDuringConflict('political'))
            .gameAction(switchConflictType({ targetConflictType: ConflictType.Military }));
    }
}


export default CaptiveAudience;
