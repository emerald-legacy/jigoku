import AbilityDsl from '../../abilitydsl.js';
import { cardCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';

class YoungHarrier extends DrawCard {
    static id = 'young-harrier';

    setupCardAbilities() {
        this.action('Prevent other characters from being dishonored')
            .cost(AbilityDsl.costs.dishonorSelf())
            .cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.player.cardsInPlay.filter((card) => card.isFaction('crane')),
                effect: cardCannot('dishonor')
            }))
            .effect('prevent Crane characters from being dishonored this phase');
    }
}


export default YoungHarrier;
