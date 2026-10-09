import { Location, CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { sendHome } from '../../GameActions/GameActions.js';

export default class SeekingtheTruth extends ProvinceCard {
    static id = 'seeking-the-truth';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            condition: (context) => !!context.player.role && context.player.role.hasTrait('water'),
            effect: modifyProvinceStrength(2)
        });

        this.interrupt('Move a character home')
            .when({
                onBreakProvince: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending()
            }, sendHome());
    }
}
