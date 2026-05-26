import DrawCard from '../../drawcard.js';
import { Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiShizue extends DrawCard {
    static id = 'doji-shizue';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: context => this.game.currentPhase === Phases.Fate && context.player.imperialFavor !== '',
            effect: [
                ability.effects.cardCannot('removeFate'),
                ability.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}


export default DojiShizue;
