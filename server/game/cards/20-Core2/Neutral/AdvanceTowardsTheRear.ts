import { CardType, Players, ConflictType } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { sendHome } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AdvanceTowardsTheRear extends DrawCard {
    static id = 'advance-towards-the-rear';

    setupCardAbilities() {
        this.action('Move a character home')
            .cost(costs.payHonor(1))
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, sendHome());
    }
}
