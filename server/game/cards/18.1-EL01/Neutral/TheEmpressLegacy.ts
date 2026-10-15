import DrawCard from '../../../DrawCard.js';
import { Players } from '../../../Constants.js';
import { canContributeGloryWhileBowed, changePlayerGloryModifier } from '../../../effects.js';

class TheEmpressLegacy extends DrawCard {
    static id = 'the-empress-legacy';

    setupCardAbilities() {
        // the +1 glory is the character's, so it counts for the character's controller
        this.persistentEffect({
            condition: (context) => !!(context.source.parentCharacter && context.source.parentCharacter.isFaction('crab')),
            targetController: Players.Any,
            match: (player) => player === this.parentCharacter?.controller,
            effect: changePlayerGloryModifier(1)
        });

        this.whileAttached({
            effect: canContributeGloryWhileBowed()
        });
    }
}


export default TheEmpressLegacy;


