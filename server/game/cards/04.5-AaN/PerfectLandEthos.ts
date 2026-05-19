import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class PerfectLandEthos extends DrawCard {
    static id = 'perfect-land-ethos';

    setupCardAbilities() {
        this.action({
            title: 'Discard each status token',
            effect: 'discard each status token',
            gameAction: AbilityDsl.actions.discardStatusToken(context => ({
                target: context.game.findAnyCardsInAnyList(card => card.hasStatusTokens).map(card => card.statusTokens)
            }))
        });
    }
}


export default PerfectLandEthos;
