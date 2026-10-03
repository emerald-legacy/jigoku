import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, PlayType } from '../../Constants.js';

class UtakuTetsuko extends DrawCard {
    static id = 'utaku-tetsuko';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: AbilityContext<this>) => context.source.isAttacking(),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.increaseCost({
                amount: 1,
                playingTypes: PlayType.PlayFromHand
            })
        });
    }
}


export default UtakuTetsuko;
