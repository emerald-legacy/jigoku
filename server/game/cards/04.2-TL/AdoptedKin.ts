import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';

class AdoptedKin extends DrawCard {
    static id = 'adopted-kin';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            limit: 1
        });

        this.persistentEffect({
            condition: (context: AbilityContext) => !!context.source.parent,
            match: (card: any, context: any) => card !== context.source && card.getType() === CardTypes.Attachment && context.source.parent === card.parent,
            effect: ability.effects.addKeyword('ancestral'),
            targetController: Players.Any
        });
    }
}


export default AdoptedKin;
