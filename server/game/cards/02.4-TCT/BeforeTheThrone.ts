import { ProvinceCard } from '../../ProvinceCard.js';
import { takeHonor } from '../../GameActions/GameActions.js';

export default class BeforeTheThrone extends ProvinceCard {
    static id = 'before-the-throne';

    setupCardAbilities() {
        this.interrupt('Take 2 honor')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .gameAction(takeHonor({ amount: 2 }));
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
