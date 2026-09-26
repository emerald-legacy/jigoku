import { Players, ConflictType, Duration } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class CastleOfTheForgotten extends StrongholdCard {
    static id = 'castle-of-the-forgotten';

    setupCardAbilities() {
        this.reaction('Make all conflicts military')
            .when({
                onBreakProvince: (event, context) => event.card.owner !== context.player
            })
            .cost(AbilityDsl.costs.bowSelf())
            .gameAction(AbilityDsl.actions.playerLastingEffect({
                targetController: Players.Any,
                effect: AbilityDsl.effects.setConflictDeclarationType(ConflictType.Military),
                duration: Duration.UntilEndOfPhase
            }))
            .effect('make all future conflicts {1} for this phase', () => (['military']));
    }
}
