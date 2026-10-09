import { increaseCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Players, PlayType } from '../../Constants.js';

class UtakuTetsuko extends DrawCard {
    static id = 'utaku-tetsuko';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            targetController: Players.Opponent,
            effect: increaseCost({
                amount: 1,
                playingTypes: PlayType.PlayFromHand
            })
        });
    }
}


export default UtakuTetsuko;
