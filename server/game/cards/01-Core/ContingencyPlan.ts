import { Direction } from '../../GameActions/ModifyBidAction.js';
import DrawCard from '../../DrawCard.js';

export default class ContingencyPlan extends DrawCard {
    static id = 'contingency-plan';

    public override setupCardAbilities() {
        this.reaction('Change your bid by 1')
            .when({ onHonorDialsRevealed: () => true })
            .modifyBid({ direction: Direction.Prompt });
    }
}
