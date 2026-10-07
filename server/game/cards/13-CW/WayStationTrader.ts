import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class WayStationTrader extends DrawCard {
    static id = 'way-station-trader';

    setupCardAbilities() {
        this.reaction('Take a fate from your opponent')
            .when({
                onCardRevealed: (event, context) => event.card.type === CardType.Province && context.source.isParticipating()
            })
            .takeFate();
    }
}


export default WayStationTrader;
