import { msg } from '../../GameChat.js';
import { Duration } from '../../Constants.js';
import { perPhase } from '../../AbilityLimit.js';
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
            .chatText((context) => msg`prevent ${context.player.opponent ?? ''} from declaring a conflict with ${context.chatTarget()}`)
            .max(perPhase(1));
    }
}
