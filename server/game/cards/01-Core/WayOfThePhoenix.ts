import { Durations, TargetModes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';
import DrawCard from '../../drawcard';
import type Player from '../../player';

type Element = 'air' | 'earth' | 'fire' | 'void' | 'water';

export default class WayOfThePhoenix extends DrawCard {
    static id = 'way-of-the-phoenix';

    public setupCardAbilities() {
        this.action({
            title: 'Prevent an opponent contesting a ring',
            condition: (context) => context.player.opponent !== undefined,
            target: {
                mode: TargetModes.Ring,
                ringCondition: () => true
            },
            effect: 'prevent {1} from declaring a conflict with {0}',
            effectArgs: (context) => context.player.opponent,
            gameAction: AbilityDsl.actions.ringLastingEffect((context) => ({
                duration: Durations.UntilEndOfPhase,
                target: (context.ring.getElements() as Element[]).map((element) => this.game.rings[element]),
                effect: AbilityDsl.effects.cannotDeclareRing((player: Player) => player === context.player.opponent)
            })),
            max: AbilityDsl.limit.perPhase(1)
        });
    }
}
