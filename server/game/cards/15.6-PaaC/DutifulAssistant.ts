import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class DutifulAssistant extends DrawCard {
    static id = 'dutiful-assistant';

    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.source.parent && context.source.parent.isHonored,
            effect: AbilityDsl.effects.modifyGlory(2)
        });
    }
}


export default DutifulAssistant;
