import { ConflictType, DuelType, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class KakitaYuri extends DrawCard {
    static id = 'kakita-yuri';

    setupCardAbilities() {
        this.action({
            title: 'Political duel to stop military conflicts',
            initiateDuel: {
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                message: 'prevent {0} from declaring military conflicts this phase',
                messageArgs: (duel) => [duel.loserController ?? 'no one'],
                gameAction: (duel) =>
                    AbilityDsl.actions.playerLastingEffect(() => ({
                        targetController: duel.loserController,
                        duration: Duration.UntilEndOfPhase,
                        effect: duel.loser
                            ? AbilityDsl.effects.cannotDeclareConflictsOfType(ConflictType.Military)
                            : []
                    }))
            }
        });
    }
}
