import { ConflictType, DuelType } from '../../../Constants.js';
import { injure } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class SteelOnSteel extends DrawCard {
    static id = 'steel-on-steel';

    setupCardAbilities() {
        this.conflictAction('Initiate a military duel, injuring the loser', { conflictType: ConflictType.Military })
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel) => injure({ target: duel.loser ?? [] })
            }));
    }
}
