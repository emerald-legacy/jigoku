import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, PlayTypes } from '../../Constants.js';

class UtakuTetsuko extends DrawCard {
    static id = 'utaku-tetsuko';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: (context: AbilityContext) => context.source.isAttacking(),
            targetController: Players.Opponent,
            effect: ability.effects.increaseCost({
                amount: 1,
                playingTypes: PlayTypes.PlayFromHand
            })
        });
    }
}


export default UtakuTetsuko;
