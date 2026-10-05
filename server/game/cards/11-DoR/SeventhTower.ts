import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { defendingAtKaiuWall } from '../kaiuWall.js';

class SeventhTower extends DrawCard {
    static id = 'seventh-tower';

    setupCardAbilities() {
        this.reaction('Resolve the ring effect')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && defendingAtKaiuWall(context.player, event.conflict)
            })
            .gameAction(AbilityDsl.actions.resolveConflictRing());
    }
}


export default SeventhTower;
