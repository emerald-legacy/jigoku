import DrawCard from '../../DrawCard.js';
import { Players, CardType, ConflictType } from '../../Constants.js';
import { sendHome } from '../../GameActions/GameActions.js';

class Retreat extends DrawCard {
    static id = 'retreat';

    override setupCardAbilities() {
        this.action('Move a character home')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, sendHome());
    }
}


export default Retreat;
