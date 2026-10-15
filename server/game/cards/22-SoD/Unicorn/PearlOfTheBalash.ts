import { Trait } from '../../../Constants.js';
import { addKeyword } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';


export default class PearlOfTheBalash extends DrawCard {
    static id = 'pearl-of-the-balash';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: Trait.Shugenja
        });

        this.whileAttached({
            effect: addKeyword('covert')
        });
    }
}
