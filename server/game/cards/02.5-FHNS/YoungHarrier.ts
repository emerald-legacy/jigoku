import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';

class YoungHarrier extends DrawCard {
    static id = 'young-harrier';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Prevent other characters from being dishonored',
            cost: ability.costs.dishonorSelf(),
            effect: 'prevent Crane characters from being dishonored this phase',
            gameAction: ability.actions.cardLastingEffect((context: AbilityContext) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.player.cardsInPlay.filter((card: DrawCard) => card.isFaction('crane')),
                effect: ability.effects.cardCannot('dishonor')
            }))
        });
    }
}


export default YoungHarrier;
