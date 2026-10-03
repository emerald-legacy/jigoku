import { CardType, Location, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class AppealingToTheFortunes extends ProvinceCard {
    static id = 'appealing-to-the-fortunes';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => !!context.player.role && context.player.role.hasTrait('void'),
            effect: AbilityDsl.effects.modifyProvinceStrength(2)
        });

        this.interrupt('Choose a character')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                location: [Location.Provinces, Location.Hand]
            }, AbilityDsl.actions.putIntoPlay());
    }
}
