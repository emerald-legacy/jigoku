import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { fixed } from '../../AbilityLimit.js';
import { reduceCost } from '../../effects.js';
import { Duration, CardType } from '../../Constants.js';

class YasukiProcurer extends DrawCard {
    static id = 'yasuki-procurer';

    setupCardAbilities() {
        this.action('Reduce the cost of the next attachment or character')
            .cost(costs.dishonorSelf())
            .playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: reduceCost({
                    match: (card) => card.type === CardType.Attachment || card.type === CardType.Character,
                    limit: fixed(1)
                })
            }))
            .effect('reduce the cost of their next attachment or character played this phase by 1');
    }
}


export default YasukiProcurer;
