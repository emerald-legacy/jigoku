import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class SilentSuburb extends ProvinceCard {
    static id = 'silent-suburb';

    setupCardAbilities() {
        this.reaction('Resolve the ring effect')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    (event.conflict.getConflictProvinces()).some((p) => p === context.source)
            })
            .gameAction(AbilityDsl.actions.resolveConflictRing());
    }
}
