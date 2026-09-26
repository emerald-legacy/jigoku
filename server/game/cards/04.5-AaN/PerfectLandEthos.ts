import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';

class PerfectLandEthos extends DrawCard {
    static id = 'perfect-land-ethos';

    setupCardAbilities() {
        this.action('Discard each status token')
            .gameAction(AbilityDsl.actions.discardStatusToken(context => ({
                target: context.game.findAnyCardsInAnyList((card: BaseCard) => card.hasStatusTokens).flatMap((card: BaseCard) => card.statusTokens)
            })))
            .effect('discard each status token');
    }
}


export default PerfectLandEthos;
