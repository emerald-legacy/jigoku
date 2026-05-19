import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WayStationTrader extends DrawCard {
    static id = 'way-station-trader';

    setupCardAbilities() {
        this.reaction({
            title: 'Take a fate from your opponent',
            when: {
                onCardRevealed: (event, context) => event.card && event.card.type === CardTypes.Province && context.source.isParticipating()
            },
            gameAction: AbilityDsl.actions.takeFate()
        });
    }
}


export default WayStationTrader;
