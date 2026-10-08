import { msg } from '../../GameChat.js';
import { ConflictType, DuelType, Duration } from '../../Constants.js';
import { perRound } from '../../AbilityLimit.js';
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
                chatText: (_context, duel) => msg`allow ${duel.winnerController ?? ''} to declare an additional political conflict this phase`,
                gameAction: (duel) =>
                    duel.winner
                        ? playerLastingEffect({
                            targetController: duel.winnerController,
                            duration: Duration.UntilEndOfPhase,
                            effect: additionalConflict(ConflictType.Political)
                        })
                        : noAction()
            }))
            .max(perRound(1));
    }
}
