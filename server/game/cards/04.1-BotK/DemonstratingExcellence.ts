import { Location } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class DemonstratingExcellence extends ProvinceCard {
    static id = 'demonstrating-excellence';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            condition: (context) => !!context.player.role && context.player.role.hasTrait('air'),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        this.interrupt('Gain 1 fate and draw 1 card')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .gameAction(AbilityDsl.actions.gainFate(), AbilityDsl.actions.draw())
            .effect('gain 1 fate and draw a card');
    }
}
