import { Locations, CardTypes } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class SeekingtheTruth extends ProvinceCard {
    static id = 'seeking-the-truth';

    public setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            condition: (context) => !!context.player.role && context.player.role.hasTrait('water'),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        this.interrupt({
            title: 'Move a character home',
            when: {
                onBreakProvince: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isDefending(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}
