import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class PerfectLandEthos extends DrawCard {
    static id = 'perfect-land-ethos';

    setupCardAbilities() {
        this.action('Discard each status token')
            .gameAction(AbilityDsl.actions.discardStatusToken(context => ({
                target: context.game.findAnyCardsInAnyList((card) => card.hasStatusTokens).flatMap((card) => card.statusTokens)
            })))
            .effect('discard each status token');
    }
}


export default PerfectLandEthos;
