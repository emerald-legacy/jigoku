import { Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

type Element = 'air' | 'earth' | 'fire' | 'void' | 'water';

export default class ReligiousConclave extends DrawCard {
    static id = 'religious-conclave';

    public setupCardAbilities() {
        this.action('Prevent an opponent contesting a ring')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition((context) => context.player.opponent !== undefined)
            .ringTarget('target', {
                ringCondition: () => true
            })
            .gameAction(AbilityDsl.actions.ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: (context.ring?.getElements() as Element[]).map((element) => context.game.rings[element]),
                effect: AbilityDsl.effects.cannotDeclareRing((player: Player) => player === context.player.opponent)
            })))
            .effect('prevent {1} from declaring a conflict with {0}', (context) => context.player.opponent);
    }
}
