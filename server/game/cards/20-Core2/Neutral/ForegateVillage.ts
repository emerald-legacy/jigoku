import { ProvinceCard } from '../../../ProvinceCard.js';
import { switchConflictType } from '../../../GameActions/GameActions.js';

export default class ForegateVillage extends ProvinceCard {
    static id = 'foregate-village';

    setupCardAbilities() {
        this.reaction('Switch the conflict type')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .gameAction(switchConflictType())
            .effect('switch the conflict type');
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
