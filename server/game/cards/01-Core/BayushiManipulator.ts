import { modifyBid } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class BayushiManipulator extends DrawCard {
    static id = 'bayushi-manipulator';

    public setupCardAbilities() {
        this.reaction('Increase bid by 1')
            .when({ onHonorDialsRevealed: (event) => event.isHonorBid })
            .gameAction(modifyBid())
            .chatText('increase their bid by 1');
    }
}
