import { Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { cannotContribute } from '../../effects.js';

export default class UnbridledAmbition extends ProvinceCard {
    static id = 'unbridled-ambition';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Any,
            effect: cannotContribute(() => (card) => card.isDishonored)
        });
    }

    override cannotBeStrongholdProvince() {
        return true;
    }
}
