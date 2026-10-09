import { msg } from '../../GameChat.js';
import { selectRing, takeRing } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class RovingMichibiku extends DrawCard {
    static id = 'roving-michibiku';

    public setupCardAbilities() {
        this.reaction('Take a ring from opponent\'s claimed pool')
            .when({
                afterConflict: (event, context) =>
                    context.source.isAttacking() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent !== undefined
            })
            .gameAction(selectRing((context) => ({
                activePromptTitle: 'Choose a ring to take',
                ringCondition: (ring) => ring.claimedBy === context.player.opponent?.name,
                message: (context, ring) => msg`${context.player} takes ${ring}`,
                gameAction: takeRing()
            })));
    }
}
