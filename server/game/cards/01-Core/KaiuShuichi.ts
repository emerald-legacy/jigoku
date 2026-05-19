import DrawCard from '../../drawcard.js';

class KaiuShuichi extends DrawCard {
    static id = 'kaiu-shuichi';

    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 1 fate',
            condition: context => context.source.isParticipating() && (context.player.getNumberOfHoldingsInPlay() > 0 ||
                                  (context.player.opponent && context.player.opponent.getNumberOfHoldingsInPlay() > 0)),
            gameAction: ability.actions.gainFate()
        });
    }
}


export default KaiuShuichi;
