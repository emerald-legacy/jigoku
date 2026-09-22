import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

class TheEmpressLegacy extends DrawCard {
    static id = 'the-empress-legacy';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !!(context.source.attachedCharacter && context.source.attachedCharacter.isFaction('crab')),
            effect: AbilityDsl.effects.changePlayerGloryModifier(1)
        });

        this.whileAttached({
            effect: AbilityDsl.effects.canContributeGloryWhileBowed()
        });
    }
}


export default TheEmpressLegacy;


