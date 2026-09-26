import { Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

export default class WayOfThePhoenix extends DrawCard {
    static id = 'way-of-the-phoenix';

    public setupCardAbilities() {
        this.action('Prevent an opponent contesting a ring')
            .condition((context) => context.player.opponent !== undefined)
            .ringTarget('target', {
                ringCondition: () => true
            })
            .gameAction(AbilityDsl.actions.ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.ring.getElements().map((element) => this.game.rings[element]),
                effect: AbilityDsl.effects.cannotDeclareRing((player: Player) => player === context.player.opponent)
            })))
            .effect('prevent {1} from declaring a conflict with {0}', (context) => context.player.opponent ?? '')
            .max(AbilityDsl.limit.perPhase(1));
    }
}
