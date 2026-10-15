import { CardType, Players, ConflictType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AdvanceTowardsTheRear extends DrawCard {
    static id = 'advance-towards-the-rear';

    override setupCardAbilities() {
        this.action('Move a character home')
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .cost(costs.payHonor(1))
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, sendHome());
    }
}
