import { ProvinceCard } from '../../ProvinceCard.js';
import { moveConflict } from '../../GameActions/GameActions.js';

export default class ShrugOffDespair extends ProvinceCard {
    static id = 'shrug-off-despair';

    setupCardAbilities() {
        this.action('Move the conflict to this province')
            .condition((context) => context.game.isDuringConflict() && !context.source.isConflictProvince())
            .gameAction(moveConflict())
            .conflictProvinceCondition(() => true);
    }
}
