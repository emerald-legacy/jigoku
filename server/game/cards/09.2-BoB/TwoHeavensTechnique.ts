import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class TwoHeavensTechnique extends DrawCard {
    static id = 'two-heavens-technique';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'bushi'
        });

        this.whileAttached({
            condition: context => context.source.parent && context.source.parent.attachments.filter(card => card.hasTrait('weapon')).length === 2,
            effect: AbilityDsl.effects.addKeyword('covert')
        });
    }
}


export default TwoHeavensTechnique;
