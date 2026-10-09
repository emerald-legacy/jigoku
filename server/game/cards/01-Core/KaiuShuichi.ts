import DrawCard from '../../DrawCard.js';

class KaiuShuichi extends DrawCard {
    static id = 'kaiu-shuichi';

    setupCardAbilities() {
        this.action('Gain 1 fate')
            .condition((context) => !!(context.source.isParticipating() && (context.player.getNumberOfHoldingsInPlay() > 0 ||
                                  (context.player.opponent && context.player.opponent.getNumberOfHoldingsInPlay() > 0))))
            .gainFate();
    }
}


export default KaiuShuichi;
