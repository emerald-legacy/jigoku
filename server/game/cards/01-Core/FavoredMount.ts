import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { addTrait } from '../../effects.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

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
            .cost(AbilityDsl.costs.bowSelf())
            .gameAction(moveToConflict(context => ({ target: context.source.parentCharacter ?? [] })));
    }
}


export default FavoredMount;
