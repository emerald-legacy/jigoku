import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { addTrait } from '../../effects.js';

class FavoredMount extends DrawCard {
    static id = 'favored-mount';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: addTrait('cavalry')
        });

        this.action('Move this character into the conflict')
            .cost(costs.bowSelf())
            .moveToConflict((context) => ({ target: context.source.parentCharacter ?? [] }));
    }
}


export default FavoredMount;
