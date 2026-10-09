import DrawCard from '../../DrawCard.js';
import { modifyGlory } from '../../effects.js';

class DutifulAssistant extends DrawCard {
    static id = 'dutiful-assistant';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => !!(context.source.parentCharacter && context.source.parentCharacter.isHonored),
            effect: modifyGlory(2)
        });
    }
}


export default DutifulAssistant;
