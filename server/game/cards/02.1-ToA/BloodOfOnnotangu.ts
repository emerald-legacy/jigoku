import { Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class BloodOfOnnotangu extends ProvinceCard {
    static id = 'blood-of-onnotangu';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            condition: (context) => context.source.isConflictProvince(),
            effect: AbilityDsl.effects.playerCannot('spendFate')
        });
    }
}
