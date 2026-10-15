import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import { addKeyword } from '../../effects.js';

class CurseOfMisfortune extends DrawCard {
    static id = 'curse-of-misfortune';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => !!card.parentCharacter && card.parentCharacter === context?.source.parentCharacter && card !== context?.source,
            targetController: Players.Any,
            effect: addKeyword('restricted')
        });
    }
}


export default CurseOfMisfortune;
