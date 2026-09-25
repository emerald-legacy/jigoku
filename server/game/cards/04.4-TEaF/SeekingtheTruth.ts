import { Location, CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class SeekingtheTruth extends ProvinceCard {
    static id = 'seeking-the-truth';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            condition: (context) => !!context.player.role && context.player.role.hasTrait('water'),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        this.interrupt('Move a character home')
            .when({
                onBreakProvince: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending()
            }, AbilityDsl.actions.sendHome());
    }
}
