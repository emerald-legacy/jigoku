import { ConflictType, DuelType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class SteelOnSteel extends DrawCard {
    static id = 'steel-on-steel';

    setupCardAbilities() {
        this.action('Initiate a military duel, injuring the loser')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel) => AbilityDsl.actions.injure({ target: duel.loser ?? [] })
            }));
    }
}
