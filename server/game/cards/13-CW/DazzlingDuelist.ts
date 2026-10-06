import { DuelType } from '../../Constants.js';
import { playerCannot } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class DazzlingDuelist extends DrawCard {
    static id = 'dazzling-duelist';

    setupCardAbilities() {
        this.action('Military duel to stop a player from claiming rings')
            .initiateDuel(() => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                message: 'prevent {0} from claiming rings this conflict',
                messageArgs: (duel) => [duel.loserController ?? ''],
                gameAction: (duel) =>
                    playerLastingEffect({
                        targetController: duel.loserController,
                        effect: duel.loser ? playerCannot('claimRings') : []
                    })
            }));
    }
}
