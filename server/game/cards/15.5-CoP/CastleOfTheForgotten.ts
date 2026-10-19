import { Players, ConflictType, Duration } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { setConflictDeclarationType } from '../../effects.js';
import { msg } from '../../GameChat.js';

export default class CastleOfTheForgotten extends StrongholdCard {
    static id = 'castle-of-the-forgotten';

    override setupCardAbilities() {
        this.reaction('Make all conflicts military')
            .when({
                // RRG: a province broken outside conflict resolution is broken by its controller's opponent
                onBreakProvince: (event, context) => event.card.controller !== context.player
            })
            .cost(costs.bowSelf())
            .playerLastingEffect({
                target: Players.Any,
                effect: setConflictDeclarationType(ConflictType.Military),
                duration: Duration.UntilEndOfRound
            })
            .chatText(() => msg`make all future conflicts ${'military'} for this round`);
    }
}
