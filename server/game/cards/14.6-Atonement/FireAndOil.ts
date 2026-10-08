import * as costs from '../../costs/index.js';
import { gainAbility } from '../../effects.js';
import { dishonor } from '../../GameActions/GameActions.js';
import { AbilityType, CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class FireAndOil extends DrawCard {
    static id = 'fire-and-oil';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !context.player.getProvinceCardInProvince(context.source.location)?.isBroken,
            effect: gainAbility(AbilityType.Action, {
                title: 'Dishonor a character',
                condition: (context) =>
                    !!context.game.currentConflict &&
                    context.game.currentConflict.getConflictProvinces().some((a) => a.controller === context.player),
                cost: costs.payHonor(1),
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card) => card.isAttacking(),
                    gameAction: dishonor()
                }
            })
        });
    }
}
