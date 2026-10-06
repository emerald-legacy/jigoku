import { ProvinceCard } from '../../ProvinceCard.js';
import { resolveConflictRing } from '../../GameActions/GameActions.js';

export default class DefendTheWall extends ProvinceCard {
    static id = 'defend-the-wall';

    setupCardAbilities() {
        this.reaction('Resolve the ring effect')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.getConflictProvinces().some((a) => a === context.source) &&
                    event.conflict.winner === context.player
            })
            .gameAction(resolveConflictRing());
    }
}
