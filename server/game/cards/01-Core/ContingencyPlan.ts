import { Direction } from '../../GameActions/ModifyBidAction.js';
import { modifyBid } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class ContingencyPlan extends DrawCard {
    static id = 'contingency-plan';

    public setupCardAbilities() {
        this.reaction('Change your bid by 1')
            .when({ onHonorDialsRevealed: (event) => event.isHonorBid })
            .gameAction(modifyBid({ direction: Direction.Prompt }));
    }
}
