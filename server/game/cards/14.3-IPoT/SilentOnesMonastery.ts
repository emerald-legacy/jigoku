import { Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class SilentOnesMonastery extends ProvinceCard {
    static id = 'silent-ones-monastery';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.limitHonorGainPerPhase(2)
        });
    }
}
