import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';

class CurseOfMisfortune extends DrawCard {
    static id = 'curse-of-misfortune';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card: DrawCard, context?: AbilityContext<this>) => !!card.parent && card.parent === context?.source?.parent && card !== context?.source,
            targetController: Players.Any,
            effect: AbilityDsl.effects.addKeyword('restricted')
        });
    }
}


export default CurseOfMisfortune;
