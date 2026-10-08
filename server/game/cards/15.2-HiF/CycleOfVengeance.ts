import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { honor, multiple, placeFate } from '../../GameActions/GameActions.js';

export default class CycleOfVengeance extends ProvinceCard {
    static id = 'cycle-of-vengeance';

    setupCardAbilities() {
        this.interrupt('Place a fate on a character then honor it')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character
            }, multiple([
                placeFate(),
                honor()
            ]))
            .chatText('honor and place a fate on {0}');
    }
}
