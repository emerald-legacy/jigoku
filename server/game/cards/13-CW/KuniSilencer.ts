import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { returnRing, selectRing } from '../../GameActions/GameActions.js';
import { Players } from '../../Constants.js';

class KuniSilencer extends DrawCard {
    static id = 'kuni-silencer';

    setupCardAbilities() {
        this.reaction('Take a ring from opponent\'s claimed pool')
            .when({
                afterConflict: (event, context) => context.player.opponent && event.conflict.winner === context.source.controller && context.source.isDefending()
            })
            .gameAction(selectRing((context) => ({
                activePromptTitle: 'Choose a ring to return',
                player: Players.Opponent,
                ringCondition: (ring) => ring.claimedBy !== undefined && ring.claimedBy === context.player.opponent?.name,
                message: (context, ring) => msg`${context.player.opponent} returns ${ring}`,
                gameAction: returnRing()
            })));
    }
}


export default KuniSilencer;
