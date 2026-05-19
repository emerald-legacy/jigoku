import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Players } from '../../Constants.js';

class NimbleNoyan extends DrawCard {
    static id = 'nimble-noyan';

    setupCardAbilities() {
        this.dire({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: card => card.type === CardTypes.Character && card.isParticipating(),
            effect: AbilityDsl.effects.canContributeWhileBowed()
        });
    }
}


export default NimbleNoyan;
