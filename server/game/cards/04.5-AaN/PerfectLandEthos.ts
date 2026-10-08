import DrawCard from '../../DrawCard.js';
import { discardStatusToken } from '../../GameActions/GameActions.js';

class PerfectLandEthos extends DrawCard {
    static id = 'perfect-land-ethos';

    setupCardAbilities() {
        this.action('Discard each status token')
            .gameAction(discardStatusToken(context => ({
                target: context.game.findAnyCardsInAnyList((card) => card.hasStatusTokens).flatMap((card) => card.statusTokens)
            })))
            .chatText('discard each status token');
    }
}


export default PerfectLandEthos;
