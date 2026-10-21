import { ProvinceCard } from '../../ProvinceCard.js';
import { moveConflict } from '../../GameActions/GameActions.js';

export default class ShrugOffDespair extends ProvinceCard {
    static id = 'shrug-off-despair';

    override setupCardAbilities() {
        this.action('Move the conflict to this province')
            // "a conflict at another province you control"; resolved as if the conflict were here (Keeper of Secret Names), it isn't at another one
            .condition((context) => !context.asIfConflictAt && !context.source.isConflictProvince() &&
                !!context.game.currentConflict?.getConflictProvinces().some((province) => province.controller === context.player))
            .conflictProvinceCondition(() => true)
            .gameAction(moveConflict());
    }

    override cannotBeStrongholdProvince() {
        return true;
    }
}
