import { addKeyword } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class InfiltratorsTools extends DrawCard {
    static id = 'infiltrator-s-tools';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'shinobi'
        });

        this.whileAttached({
            effect: addKeyword('covert')
        });
    }
}


export default InfiltratorsTools;
