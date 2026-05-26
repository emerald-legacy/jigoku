import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../basecard.js';

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
