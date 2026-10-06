import DrawCard from '../../DrawCard.js';
import { resolveConflictEarly } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';

class MomentOfPerfectBeauty extends DrawCard {
    static id = 'moment-of-perfect-beauty';

    setupCardAbilities() {
        this.action('One more action and then end the conflict')
            .condition(context => {
                const conflict = this.game.currentConflict;
                return !!conflict &&
                    conflict.getNumberOfParticipantsFor(context.player, (card) => card.isHonored) >
                    conflict.getNumberOfParticipantsFor(context.player.opponent, (card) => card.isHonored);
            })
            .gameAction(playerLastingEffect(context => ({
                targetController: context.player.opponent,
                effect: resolveConflictEarly()
            })))
            .effect('resolve the conflict after {1}\'s next action', context => [context.player.opponent]);
    }
}


export default MomentOfPerfectBeauty;
