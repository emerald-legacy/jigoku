import { Trait } from '../../Constants.js';
import { addKeyword } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class InfiltratorsTools extends DrawCard {
    static id = 'infiltrator-s-tools';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: Trait.Shinobi
        });

        this.whileAttached({
            effect: addKeyword('covert')
        });
    }
}


export default InfiltratorsTools;
