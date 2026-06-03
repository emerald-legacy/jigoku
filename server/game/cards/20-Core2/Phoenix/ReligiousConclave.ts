import { TargetMode, Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

type Element = 'air' | 'earth' | 'fire' | 'void' | 'water';

export default class ReligiousConclave extends DrawCard {
    static id = 'religious-conclave';

    public setupCardAbilities() {
        this.action({
            title: 'Prevent an opponent contesting a ring',
            condition: (context) => context.player.opponent !== undefined,
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                mode: TargetMode.Ring,
                ringCondition: () => true
            },
            effect: 'prevent {1} from declaring a conflict with {0}',
            effectArgs: (context) => context.player.opponent as any,
            gameAction: AbilityDsl.actions.ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: (context.ring.getElements() as Element[]).map((element) => context.game.rings[element]),
                effect: AbilityDsl.effects.cannotDeclareRing((player: Player) => player === context.player.opponent)
            }))
        });
    }
}
