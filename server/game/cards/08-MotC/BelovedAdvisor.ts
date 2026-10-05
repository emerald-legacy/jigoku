import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class BelovedAdvisor extends DrawCard {
    static id = 'beloved-advisor';

    setupCardAbilities() {
        this.action('Each player draws 1 card')
            .gameAction(AbilityDsl.actions.draw(context => ({
                target: context.game.getPlayers()
            })));
    }
}


export default BelovedAdvisor;
