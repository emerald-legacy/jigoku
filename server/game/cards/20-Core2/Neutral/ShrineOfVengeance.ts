import { CardType, Location } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { dishonorProvince, reveal, sequential } from '../../../GameActions/GameActions.js';

export default class ShrineOfVengeance extends ProvinceCard {
    static id = 'shrine-of-vengeance';

    public setupCardAbilities() {
        this.interrupt('Blank and reveal a province')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.facedown
            }, sequential([
                dishonorProvince(),
                reveal({ chatMessage: true })
            ]));
    }
}
