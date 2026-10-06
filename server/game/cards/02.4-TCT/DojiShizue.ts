import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import { cardCannot } from '../../effects.js';

class DojiShizue extends DrawCard {
    static id = 'doji-shizue';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => this.game.currentPhase === Phases.Fate && context.player.imperialFavor !== '',
            effect: [
                cardCannot('removeFate'),
                cardCannot('discardFromPlay')
            ]
        });
    }
}


export default DojiShizue;
