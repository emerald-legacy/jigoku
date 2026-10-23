import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Players, Phase, RestrictionType, RestrictionScope } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { playerCannot } from '../../effects.js';
import { ringLastingEffect } from '../../GameActions/GameActions.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class ExpertInterpreter extends DrawCard {
    static id = 'expert-interpreter';

    override setupCardAbilities() {
        this.reaction('Prevent characters from entering play while contesting a ring')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Conflict
            })
            .cost(costs.optionalTakeHonorFromOpponent())
            .ringTarget({
                name: 'myRing',
                ringCondition: () => true
            }, ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                condition: () => context.rings.myRing.isContested() && this.game.currentConflict?.ring === context.rings.myRing,
                effect: playerCannot({
                    cannot: RestrictionType.EnterPlay,
                    appliesTo: RestrictionScope.Characters
                })
            })))
            .ringTarget({
                name: 'oppRing',
                player: Players.Opponent,
                optional: true,
                hideIfNoLegalTargets: true,
                ringCondition: (_ring, context) => !!context.costs.honorTakenFromOpponent
            }, ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                condition: () => context.rings.oppRing.isContested() && this.game.currentConflict?.ring === context.rings.oppRing,
                effect: playerCannot({
                    cannot: RestrictionType.EnterPlay,
                    appliesTo: RestrictionScope.Characters
                })
            })))
            .firstPlayerChoosesFirst()
            .chatText((context) => msg`prevent characters from entering play while the ${context.rings.myRing} is contested${honorTransferMessage(context, context.rings.oppRing, (ring) => msg`also apply this effect to the ${ring}`)}`);
    }
}


export default ExpertInterpreter;
