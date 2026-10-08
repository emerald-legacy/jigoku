import DrawCard from '../../../DrawCard.js';

class OtomoSycophant extends DrawCard {
    static id = 'otomo-sycophant';

    setupCardAbilities() {
        this.action('Honor Self')
            .condition((context) => context.player.imperialFavor !== '')
            .honor();
    }
}

export default OtomoSycophant;
