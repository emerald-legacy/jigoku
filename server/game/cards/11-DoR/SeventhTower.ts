import DrawCard from '../../DrawCard.js';
import { resolveConflictRing } from '../../GameActions/GameActions.js';
import { defendingAtKaiuWall } from '../kaiuWall.js';

class SeventhTower extends DrawCard {
    static id = 'seventh-tower';

    setupCardAbilities() {
        this.reaction('Resolve the ring effect')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && defendingAtKaiuWall(context.player, event.conflict)
            })
            .gameAction(resolveConflictRing());
    }
}


export default SeventhTower;
