import { ProvinceCard } from '../../../ProvinceCard.js';

export default class ForegateVillage extends ProvinceCard {
    static id = 'foregate-village';

    override setupCardAbilities() {
        this.reaction('Switch the conflict type')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .switchConflictType()
            .chatText('switch the conflict type');
    }

    override cannotBeStrongholdProvince() {
        return true;
    }
}
