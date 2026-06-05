import { Players } from '../../Constants.js';
import type DrawCard from '../../DrawCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class UnbridledAmbition extends ProvinceCard {
    static id = 'unbridled-ambition';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetController: Players.Any,
            effect: AbilityDsl.effects.cannotContribute(() => (card: DrawCard) => card.isDishonored)
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
