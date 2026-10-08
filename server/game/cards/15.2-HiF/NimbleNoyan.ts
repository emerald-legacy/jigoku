import DrawCard from '../../DrawCard.js';
import { canContributeWhileBowed } from '../../effects.js';
import { CardType, Players } from '../../Constants.js';

class NimbleNoyan extends DrawCard {
    static id = 'nimble-noyan';

    setupCardAbilities() {
        this.dire({
            condition: (context) => context.source.isParticipating(),
            targetController: Players.Any,
            match: (card) => card.type === CardType.Character && card.isParticipating(),
            effect: canContributeWhileBowed()
        });
    }
}


export default NimbleNoyan;
