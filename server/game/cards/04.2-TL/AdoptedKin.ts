import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class AdoptedKin extends DrawCard {
    static id = 'adopted-kin';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            limit: 1
        });

        this.persistentEffect({
            condition: (context: AbilityContext<this>) => !!context.source.parentCharacter,
            match: (card, context) => card !== context?.source && card.getType() === CardType.Attachment && (context?.source as DrawCard).parentCharacter === (card as DrawCard).parentCharacter,
            effect: ability.effects.addKeyword('ancestral'),
            targetController: Players.Any
        });
    }
}


export default AdoptedKin;
