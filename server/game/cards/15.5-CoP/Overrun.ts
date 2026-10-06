import DrawCard from '../../DrawCard.js';
import { Location, CardType, Players } from '../../Constants.js';
import { dishonorProvince, reveal, sequential } from '../../GameActions/GameActions.js';

class Overrun extends DrawCard {
    static id = 'overrun';

    setupCardAbilities() {
        this.reaction('Blank and reveal a province')
            .when({
                onBreakProvince: (event, context) => event.card.owner !== context.player
            })
            .target({
                location: Location.Provinces,
                cardType: CardType.Province,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.controller !== context.player
            }, sequential([
                dishonorProvince(),
                reveal({ chatMessage: true })
            ]));
    }
}


export default Overrun;
