import { CardTypes } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class CycleOfVengeance extends ProvinceCard {
    static id = 'cycle-of-vengeance';

    setupCardAbilities() {
        this.interrupt({
            title: 'Place a fate on a character then honor it',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.placeFate({ amount: 1 }),
                    AbilityDsl.actions.honor()
                ])
            },
            effect: 'honor and place a fate on {0}'
        });
    }
}
