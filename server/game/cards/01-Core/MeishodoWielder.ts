import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class MeishodoWielder extends DrawCard {
    static id = 'meishodo-wielder';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            location: Location.Any,
            condition: (context: AbilityContext) => this.game.getFirstPlayer() === context.player,
            effect: ability.effects.reduceCost({
                match: (card, source) => card === source
            })
        });
    }
}


export default MeishodoWielder;
