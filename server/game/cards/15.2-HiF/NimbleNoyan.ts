import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';

class NimbleNoyan extends DrawCard {
    static id = 'nimble-noyan';

    setupCardAbilities() {
        this.dire({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: card => card.type === CardType.Character && card.isParticipating(),
            effect: AbilityDsl.effects.canContributeWhileBowed()
        });
    }
}


export default NimbleNoyan;
