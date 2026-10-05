import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class BayushiManipulator extends DrawCard {
    static id = 'bayushi-manipulator';

    public setupCardAbilities() {
        this.reaction('Increase bid by 1')
            .when({ onHonorDialsRevealed: (event) => event.isHonorBid })
            .gameAction(AbilityDsl.actions.modifyBid())
            .effect('increase their bid by 1');
    }
}
