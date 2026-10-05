import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class KaiuShuichi extends DrawCard {
    static id = 'kaiu-shuichi';

    setupCardAbilities() {
        this.action('Gain 1 fate')
            .condition(context => !!(context.source.isParticipating() && (context.player.getNumberOfHoldingsInPlay() > 0 ||
                                  (context.player.opponent && context.player.opponent.getNumberOfHoldingsInPlay() > 0))))
            .gameAction(AbilityDsl.actions.gainFate());
    }
}


export default KaiuShuichi;
