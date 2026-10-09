import { msg } from '../../GameChat.js';
import { DuelType, RestrictionType } from '../../Constants.js';
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
                chatText: (_context, duel) => msg`prevent ${duel.loserController ?? ''} from claiming rings this conflict`,
                gameAction: (duel) =>
                    playerLastingEffect({
                        targetController: duel.loserController,
                        effect: duel.loser ? playerCannot(RestrictionType.ClaimRings) : []
                    })
            }));
    }
}
