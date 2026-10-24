import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { returnRing } from '../../GameActions/GameActions.js';
import { Players } from '../../Constants.js';

class KuniSilencer extends DrawCard {
    static id = 'kuni-silencer';

    override setupCardAbilities() {
        this.reaction('Make your opponent return a claimed ring')
            .when({
                afterConflict: (event, context) => context.player.opponent && event.conflict.isOnWinningSide(context.source) && context.source.isDefending()
            })
            .selectRing((context) => ({
                activePromptTitle: 'Choose a ring to return',
                player: Players.Opponent,
                ringCondition: (ring) => ring.claimedBy !== undefined && ring.claimedBy === context.player.opponent?.name,
                message: (context, ring) => msg`${context.player.opponent} returns ${ring}`,
                gameAction: returnRing()
            }))
            .chatText((context) => msg`make ${context.player.opponent} return one of their claimed rings`);
    }
}


export default KuniSilencer;
