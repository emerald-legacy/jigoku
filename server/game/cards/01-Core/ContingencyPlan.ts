import { Direction } from '../../GameActions/ModifyBidAction.js';
import DrawCard from '../../DrawCard.js';

export default class ContingencyPlan extends DrawCard {
    static id = 'contingency-plan';

    public setupCardAbilities() {
        this.reaction('Change your bid by 1')
            .when({ onHonorDialsRevealed: (event) => event.isHonorBid })
            .modifyBid({ direction: Direction.Prompt });
    }
}
