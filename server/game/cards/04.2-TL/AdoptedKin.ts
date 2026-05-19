import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class AdoptedKin extends DrawCard {
    static id = 'adopted-kin';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            limit: 1
        });

        this.persistentEffect({
            condition: context => !!context.source.parent,
            match: (card, context) => card !== context.source && card.getType() === CardTypes.Attachment && context.source.parent === card.parent,
            effect: ability.effects.addKeyword('ancestral'),
            targetController: Players.Any
        });
    }
}


export default AdoptedKin;
