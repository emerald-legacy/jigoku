import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, CardTypes } from '../../Constants.js';
import DrawCard from '../../drawcard.js';
import { ActionProps } from '../../Interfaces.js';

export default class FireAndOil extends DrawCard {
    static id = 'fire-and-oil';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !context.player.getProvinceCardInProvince(context.source.location).isBroken,
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Dishonor a character',
                condition: (context) =>
                    context.game.currentConflict &&
                    context.game.currentConflict.getConflictProvinces().some((a) => a.controller === context.player),
                cost: AbilityDsl.costs.payHonor(1),
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card) => card.isAttacking(),
                    gameAction: AbilityDsl.actions.dishonor()
                }
            } as ActionProps<this>)
        });
    }
}
