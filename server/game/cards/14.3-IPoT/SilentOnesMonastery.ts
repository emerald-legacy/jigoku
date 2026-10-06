import { Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { limitHonorGainPerPhase } from '../../effects.js';

export default class SilentOnesMonastery extends ProvinceCard {
    static id = 'silent-ones-monastery';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            effect: limitHonorGainPerPhase(2)
        });
    }
}
