import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players } from '../../Constants.js';

class KuniSilencer extends DrawCard {
    static id = 'kuni-silencer';

    setupCardAbilities() {
        this.reaction({
            title: 'Take a ring from opponent\'s claimed pool',
            when: {
                afterConflict: (event, context) => context.player.opponent && event.conflict.winner === context.source.controller && context.source.isDefending()
            },
            gameAction: AbilityDsl.actions.selectRing(context => ({
                activePromptTitle: 'Choose a ring to return',
                player: Players.Opponent,
                ringCondition: ring => context.player.opponent && ring.claimedBy === context.player.opponent.name,
                message: '{0} returns {1}',
                messageArgs: ring => [context.player.opponent, ring],
                gameAction: AbilityDsl.actions.returnRing()
            }))
        });
    }
}


export default KuniSilencer;
