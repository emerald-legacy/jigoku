import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CurseOfMisfortune extends DrawCard {
    static id = 'curse-of-misfortune';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => !!card.parentCharacter && card.parentCharacter === context?.source.parentCharacter && card !== context?.source,
            targetController: Players.Any,
            effect: AbilityDsl.effects.addKeyword('restricted')
        });
    }
}


export default CurseOfMisfortune;
