import DrawCard from '../../DrawCard.js';

class KaiuShuichi extends DrawCard {
    static id = 'kaiu-shuichi';

    override setupCardAbilities() {
        this.action('Gain 1 fate')
            .condition((context) => context.source.isParticipating())
            .ifCondition((context) => context.player.getNumberOfHoldingsInPlay() > 0 || (context.player.opponent?.getNumberOfHoldingsInPlay() ?? 0) > 0)
            .gainFate();
    }
}


export default KaiuShuichi;
