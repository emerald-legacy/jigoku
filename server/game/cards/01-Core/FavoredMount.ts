import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class FavoredMount extends DrawCard {
    static id = 'favored-mount';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('cavalry')
        });

        this.action('Move this character into the conflict')
            .cost(AbilityDsl.costs.bowSelf())
            .gameAction(AbilityDsl.actions.moveToConflict(context => ({ target: context.source.parentCharacter ?? [] })));
    }
}


export default FavoredMount;
