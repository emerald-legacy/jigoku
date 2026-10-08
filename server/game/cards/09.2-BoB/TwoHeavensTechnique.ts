import DrawCard from '../../DrawCard.js';
import { addKeyword } from '../../effects.js';

class TwoHeavensTechnique extends DrawCard {
    static id = 'two-heavens-technique';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'bushi'
        });

        this.whileAttached({
            condition: (context) => !!context.source.parentCharacter && context.source.parentCharacter.attachments.filter((card) => card.hasTrait('weapon')).length === 2,
            effect: addKeyword('covert')
        });
    }
}


export default TwoHeavensTechnique;
