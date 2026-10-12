import { msg } from '../../../GameChat.js';
import { ConflictType, Location } from '../../../Constants.js';
import { breakProvince } from '../../../GameActions/GameActions.js';
import type { Conflict } from '../../../Conflict.js';
import DrawCard from '../../../DrawCard.js';

function areAllAttackersBerserker(conflict: Conflict) {
    return conflict.attackers.every((c) => c.hasTrait('berserker'));
}

export default class WarCry extends DrawCard {
    static id = 'war-cry';

    setupCardAbilities() {
        this.reaction('Break the attacked province')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.attackingPlayer === context.player &&
                    event.conflict.conflictType === ConflictType.Military &&
                    !event.conflict.isAtStrongholdProvince() &&
                    areAllAttackersBerserker(event.conflict)
            })
            .selectAttackedProvince({
                cardCondition: (card) => card.location !== Location.StrongholdProvince,
                message: (context, cards) => msg`${context.player} breaks ${cards}`,
                gameAction: breakProvince()
            })
            .chatText('break an attacked province');
    }
}
