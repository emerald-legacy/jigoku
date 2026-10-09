import { bow, dishonor, multiple } from '../../../GameActions/GameActions.js';
import { DuelType, ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShochuBrawl extends DrawCard {
    static id = 'shochu-brawl';

    setupCardAbilities() {
        this.conflictAction('Initiate a Military Duel, bowing the loser and dishonoring the winner', { conflictType: ConflictType.Political })
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel) =>
                    multiple([
                        bow({ target: duel.loser }),
                        dishonor({ target: duel.winner })
                    ])
            }));
    }
}
