import DrawCard from '../../DrawCard.js';
import { draw } from '../../GameActions/GameActions.js';

class BelovedAdvisor extends DrawCard {
    static id = 'beloved-advisor';

    setupCardAbilities() {
        this.action('Each player draws 1 card')
            .gameAction(draw(context => ({
                target: context.game.getPlayers()
            })));
    }
}


export default BelovedAdvisor;
