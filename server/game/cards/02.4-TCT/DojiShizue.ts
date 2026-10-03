import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiShizue extends DrawCard {
    static id = 'doji-shizue';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => this.game.currentPhase === Phases.Fate && context.player.imperialFavor !== '',
            effect: [
                AbilityDsl.effects.cardCannot('removeFate'),
                AbilityDsl.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}


export default DojiShizue;
