import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';
import { additionalAction } from '../../effects.js';

class AustereExemplar extends DrawCard {
    static id = 'austere-exemplar';

    setupCardAbilities() {
        this.action('Take three actions')
            .cost(costs.payFateToRing())
            .condition((context) => context.source.isAttacking())
            .playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilPassPriority,
                effect: additionalAction(3)
            }))
            .chatText('take three actions')
            .limit(perConflict(1));
    }
}


export default AustereExemplar;
