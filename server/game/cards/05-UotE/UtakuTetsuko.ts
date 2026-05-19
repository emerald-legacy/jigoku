import DrawCard from '../../drawcard.js';
import { Players, PlayTypes } from '../../Constants.js';

class UtakuTetsuko extends DrawCard {
    static id = 'utaku-tetsuko';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            targetController: Players.Opponent,
            effect: ability.effects.increaseCost({
                amount: 1,
                playingTypes: PlayTypes.PlayFromHand
            })
        });
    }
}


export default UtakuTetsuko;
