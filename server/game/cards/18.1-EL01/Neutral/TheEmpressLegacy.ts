import DrawCard from '../../../DrawCard.js';
import { canContributeGloryWhileBowed, changePlayerGloryModifier } from '../../../effects.js';

class TheEmpressLegacy extends DrawCard {
    static id = 'the-empress-legacy';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !!(context.source.parentCharacter && context.source.parentCharacter.isFaction('crab')),
            effect: changePlayerGloryModifier(1)
        });

        this.whileAttached({
            effect: canContributeGloryWhileBowed()
        });
    }
}


export default TheEmpressLegacy;


