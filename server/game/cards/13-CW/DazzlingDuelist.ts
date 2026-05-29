import { DuelTypes, Durations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class DazzlingDuelist extends DrawCard {
    static id = 'dazzling-duelist';

    setupCardAbilities() {
        this.action({
            title: 'Military duel to stop a player from claiming rings',
            initiateDuel: {
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                message: 'prevent {0} from claiming rings this conflict',
                messageArgs: (duel) => [duel.loserController ?? ''],
                gameAction: (duel) =>
                    AbilityDsl.actions.playerLastingEffect(() => ({
                        targetController: duel.loserController,
                        duration: Durations.UntilEndOfConflict,
                        effect: duel.loser ? AbilityDsl.effects.playerCannot('claimRings') : []
                    }))
            }
        });
    }
}
