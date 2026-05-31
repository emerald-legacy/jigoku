import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class InfiltratorsTools extends DrawCard {
    static id = 'infiltrator-s-tools';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            trait: 'shinobi'
        });

        this.whileAttached({
            effect: ability.effects.addKeyword('covert')
        });
    }
}


export default InfiltratorsTools;
