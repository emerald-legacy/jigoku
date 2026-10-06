import { lookAt } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { shuffle } from '../../utils/shuffle.js';
import { ConflictType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

export default class CourtOfJustice extends DrawCard {
    static id = 'court-of-justice';

    public setupCardAbilities() {
        this.reaction('Look at 3 random cards of the opponent\'s hand')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.conflictType === ConflictType.Political &&
                    context.player.opponent !== undefined
            })
            .gameAction(lookAt((context) => ({
                target: shuffle(context.player.opponent?.hand ?? []).slice(0, 3),
                message: 'reveals {0} from {1}\'s hand',
                messageArgs: (cards) => [cards, context.player.opponent]
            })))
            .effect((context) => msg`look at 3 random cards from ${context.player.opponent}'s hand`);
    }
}
