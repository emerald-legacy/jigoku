import { Duration, RestrictionScope, RestrictionType } from '../../Constants.js';
import { playerCannot, takeControl } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

export default class PerfectGuest extends DrawCard {
    static id = 'perfect-guest';

    public override setupCardAbilities() {
        this.action('Give control of this character')
            .condition((context) => context.player.opponent !== undefined)
            .cardLastingEffect((context) => ({
                effect: takeControl(context.player.opponent),
                duration: Duration.Custom
            }))
            .playerLastingEffect((context) => ({
                target: context.player.opponent,
                duration: Duration.UntilEndOfRound,
                effect: playerCannot({ cannot: RestrictionType.TriggerAbilities, appliesTo: RestrictionScope.ThisAbility })
            }))
            .chatText((context) => msg`give control of itself to ${context.player.opponent ?? context.player}`);
    }
}
