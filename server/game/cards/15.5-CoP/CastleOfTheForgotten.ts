import { Players, ConflictType, Duration } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { setConflictDeclarationType } from '../../effects.js';
import { msg } from '../../GameChat.js';

export default class CastleOfTheForgotten extends StrongholdCard {
    static id = 'castle-of-the-forgotten';

    setupCardAbilities() {
        this.reaction('Make all conflicts military')
            .when({
                onBreakProvince: (event, context) => event.card.owner !== context.player
            })
            .cost(costs.bowSelf())
            .playerLastingEffect({
                targetController: Players.Any,
                effect: setConflictDeclarationType(ConflictType.Military),
                duration: Duration.UntilEndOfPhase
            })
            .effect(() => msg`make all future conflicts ${'military'} for this phase`);
    }
}
