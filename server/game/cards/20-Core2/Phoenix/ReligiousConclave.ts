import { Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { cannotDeclareRing } from '../../../effects.js';
import { ringLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ReligiousConclave extends DrawCard {
    static id = 'religious-conclave';

    public setupCardAbilities() {
        this.action('Prevent an opponent contesting a ring')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition((context) => context.player.opponent !== undefined)
            .ringTarget({
                ringCondition: () => true
            })
            .gameAction(ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.ring.getElements().map((element) => context.game.rings[element]),
                effect: cannotDeclareRing((player) => player === context.player.opponent)
            })))
            .effect('prevent {1} from declaring a conflict with {0}', (context) => context.player.opponent);
    }
}
