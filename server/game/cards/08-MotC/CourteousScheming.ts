import { ConflictType, DuelType, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { additionalConflict } from '../../effects.js';
import { noAction, playerLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class CourteousScheming extends DrawCard {
    static id = 'courteous-scheming';

    setupCardAbilities() {
        this.conflictAction('Initiate a political duel', { conflictType: ConflictType.Political })
            .initiateDuel(() => ({
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                message: 'allow {0} to declare an additional political conflict this phase',
                messageArgs: (duel) => [duel.winnerController ?? ''],
                gameAction: (duel) =>
                    duel.winner
                        ? playerLastingEffect({
                            targetController: duel.winnerController,
                            duration: Duration.UntilEndOfPhase,
                            effect: additionalConflict(ConflictType.Political)
                        })
                        : noAction()
            }))
            .max(AbilityDsl.limit.perRound(1));
    }
}
