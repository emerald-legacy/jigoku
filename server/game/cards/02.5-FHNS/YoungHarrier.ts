import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';

class YoungHarrier extends DrawCard {
    static id = 'young-harrier';

    setupCardAbilities() {
        this.action('Prevent other characters from being dishonored')
            .cost(AbilityDsl.costs.dishonorSelf())
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.player.cardsInPlay.filter((card: DrawCard) => card.isFaction('crane')),
                effect: AbilityDsl.effects.cardCannot('dishonor')
            })))
            .effect('prevent Crane characters from being dishonored this phase');
    }
}


export default YoungHarrier;
