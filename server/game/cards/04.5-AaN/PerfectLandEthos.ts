import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';

class PerfectLandEthos extends DrawCard {
    static id = 'perfect-land-ethos';

    setupCardAbilities() {
        this.action({
            title: 'Discard each status token',
            effect: 'discard each status token',
            gameAction: AbilityDsl.actions.discardStatusToken(context => ({
                target: context.game.findAnyCardsInAnyList((card: BaseCard) => card.hasStatusTokens).map((card: BaseCard) => card.statusTokens)
            }))
        });
    }
}


export default PerfectLandEthos;
