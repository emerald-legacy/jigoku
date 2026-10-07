import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { switchConflictType } from '../../GameActions/GameActions.js';

class IkomaUjiaki2 extends DrawCard {
    static id = 'ikoma-ujiaki-2';

    setupCardAbilities() {
        this.action('Switch the conflict type')
            .cost(costs.payHonor(2))
            .condition(context => context.source.isParticipating())
            .gameAction(switchConflictType())
            .effect('switch the conflict type');
    }
}


export default IkomaUjiaki2;
