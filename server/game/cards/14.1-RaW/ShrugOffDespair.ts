import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ShrugOffDespair extends ProvinceCard {
    static id = 'shrug-off-despair';

    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to this province',
            conflictProvinceCondition: () => true,
            condition: (context) => context.game.isDuringConflict() && !context.source.isConflictProvince(),
            gameAction: AbilityDsl.actions.moveConflict((context) => ({
                target: context.source
            }))
        });
    }
}
