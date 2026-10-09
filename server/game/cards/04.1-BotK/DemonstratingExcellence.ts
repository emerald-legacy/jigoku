import { Location } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';

export default class DemonstratingExcellence extends ProvinceCard {
    static id = 'demonstrating-excellence';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            condition: (context) => !!context.player.role && context.player.role.hasTrait('air'),
            effect: modifyProvinceStrength(2)
        });

        this.interrupt('Gain 1 fate and draw 1 card')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .gainFate().draw()
            .chatText('gain 1 fate and draw a card');
    }
}
