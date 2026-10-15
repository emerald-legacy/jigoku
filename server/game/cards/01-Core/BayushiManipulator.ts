import DrawCard from '../../DrawCard.js';

export default class BayushiManipulator extends DrawCard {
    static id = 'bayushi-manipulator';

    public setupCardAbilities() {
        this.reaction('Increase bid by 1')
            .when({ onHonorDialsRevealed: () => true })
            .modifyBid()
            .chatText('increase their bid by 1');
    }
}
