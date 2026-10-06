import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

export default class AbandoningHonor extends ProvinceCard {
    static id = 'abandoning-honor';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!context.player.role && context.player.role.hasTrait('fire'),
            effect: modifyProvinceStrength(2)
        });

        this.interrupt('Choose a dishonored character')
            .when({
                onBreakProvince: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDishonored
            }, discardFromPlay());
    }
}
