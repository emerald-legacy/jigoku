import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ShrugOffDespair extends ProvinceCard {
    static id = 'shrug-off-despair';

    setupCardAbilities() {
        this.action('Move the conflict to this province')
            .condition((context) => context.game.isDuringConflict() && !context.source.isConflictProvince())
            .gameAction(AbilityDsl.actions.moveConflict((context) => ({
                target: context.source
            })))
            .conflictProvinceCondition(() => true);
    }
}
