import { ConflictType, DuelType, Duration } from '../../Constants.js';
import { cannotDeclareConflictsOfType } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class KakitaYuri extends DrawCard {
    static id = 'kakita-yuri';

    setupCardAbilities() {
        this.action('Political duel to stop military conflicts')
            .initiateDuel(() => ({
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                message: 'prevent {0} from declaring military conflicts this phase',
                messageArgs: (duel) => [duel.loserController ?? 'no one'],
                gameAction: (duel) =>
                    playerLastingEffect(() => ({
                        targetController: duel.loserController,
                        duration: Duration.UntilEndOfPhase,
                        effect: duel.loser
                            ? cannotDeclareConflictsOfType(ConflictType.Military)
                            : []
                    }))
            }));
    }
}
