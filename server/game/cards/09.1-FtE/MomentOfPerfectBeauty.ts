import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration } from '../../Constants.js';

class MomentOfPerfectBeauty extends DrawCard {
    static id = 'moment-of-perfect-beauty';

    setupCardAbilities() {
        this.action({
            title: 'One more action and then end the conflict',
            condition: context => {
                const conflict = this.game.currentConflict;
                return !!conflict && this.game.isDuringConflict() &&
                    conflict.getNumberOfParticipantsFor(context.player, (card) => card.isHonored) >
                    conflict.getNumberOfParticipantsFor(context.player.opponent, (card) => card.isHonored);
            },
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                duration: Duration.UntilEndOfConflict,
                targetController: context.player.opponent,
                effect: AbilityDsl.effects.resolveConflictEarly()
            })),
            effect: 'resolve the conflict after {1}\'s next action',
            effectArgs: context => [context.player.opponent as Player]
        });
    }
}


export default MomentOfPerfectBeauty;
