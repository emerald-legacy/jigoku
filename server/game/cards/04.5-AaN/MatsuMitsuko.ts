import { moveToConflict } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType, ConflictType } from '../../Constants.js';

class MatsuMitsuko extends DrawCard {
    static id = 'matsu-mitsuko';

    override setupCardAbilities() {
        this.action('Move a character to the conflict')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .ifCondition((context) => !!context.player.opponent && context.player.isMoreHonorable())
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, moveToConflict());
    }
}


export default MatsuMitsuko;
