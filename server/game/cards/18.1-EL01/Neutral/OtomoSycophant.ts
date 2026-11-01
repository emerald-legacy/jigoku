import DrawCard from '../../../DrawCard.js';

class OtomoSycophant extends DrawCard {
    static id = 'otomo-sycophant';

    override setupCardAbilities() {
        this.action('Honor Self')
            .ifCondition((context) => context.player.imperialFavor !== '')
            .honor();
    }
}

export default OtomoSycophant;
