import { Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { cannotDeclareRing } from '../../effects.js';
import { ringLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class WayOfThePhoenix extends DrawCard {
    static id = 'way-of-the-phoenix';

    public setupCardAbilities() {
        this.action('Prevent an opponent contesting a ring')
            .condition((context) => context.player.opponent !== undefined)
            .ringTarget({
                ringCondition: () => true
            })
            .gameAction(ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.ring.getElements().map((element) => this.game.rings[element]),
                effect: cannotDeclareRing((player) => player === context.player.opponent)
            })))
            .effect('prevent {1} from declaring a conflict with {0}', (context) => context.player.opponent ?? '')
            .max(AbilityDsl.limit.perPhase(1));
    }
}
