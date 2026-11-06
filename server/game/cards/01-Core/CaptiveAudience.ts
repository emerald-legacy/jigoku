import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { ConflictType } from '../../Constants.js';

class CaptiveAudience extends DrawCard {
    static id = 'captive-audience';

    override setupCardAbilities() {
        this.action('Change the conflict to military')
            .condition(() => this.game.isDuringConflict(ConflictType.Political))
            .cost(costs.payHonor(1))
            .switchConflictType({ targetConflictType: ConflictType.Military });
    }
}


export default CaptiveAudience;
