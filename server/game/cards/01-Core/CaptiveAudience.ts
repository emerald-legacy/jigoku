import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { switchConflictType } from '../../GameActions/GameActions.js';
import { ConflictType } from '../../Constants.js';

class CaptiveAudience extends DrawCard {
    static id = 'captive-audience';

    setupCardAbilities() {
        this.action('Change the conflict to military')
            .cost(costs.payHonor(1))
            .condition(() => this.game.isDuringConflict(ConflictType.Political))
            .gameAction(switchConflictType({ targetConflictType: ConflictType.Military }));
    }
}


export default CaptiveAudience;
