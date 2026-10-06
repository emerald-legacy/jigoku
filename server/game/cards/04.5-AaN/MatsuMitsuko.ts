import { moveToConflict } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, ConflictType } from '../../Constants.js';

class MatsuMitsuko extends DrawCard {
    static id = 'matsu-mitsuko';

    setupCardAbilities() {
        this.action('Move a character to the conflict')
            .condition(context => !!(this.game.isDuringConflict(ConflictType.Military) && context.player.opponent && context.player.isMoreHonorable()))
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, moveToConflict());
    }
}


export default MatsuMitsuko;
