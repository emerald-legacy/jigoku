import { addKeyword } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class AdoptedKin extends DrawCard {
    static id = 'adopted-kin';

    setupCardAbilities() {
        this.attachmentConditions({
            limit: 1
        });

        this.persistentEffect({
            condition: (context) => !!context.source.parentCharacter,
            match: (card, context) => card !== context?.source && card.getType() === CardType.Attachment && context?.source.parentCharacter === card.parentCharacter,
            effect: addKeyword('ancestral'),
            targetController: Players.Any
        });
    }
}


export default AdoptedKin;
