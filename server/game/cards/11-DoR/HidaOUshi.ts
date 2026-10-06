import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { additionalConflict } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import { Duration, ConflictType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class HidaOUshi extends DrawCard {
    static id = 'hida-o-ushi';

    setupCardAbilities() {
        this.reaction('Gain additional military conflict')
            .when({ afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player })
            .gameAction(playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Military)
            })))
            .effect((context) => msg`allow ${context.player} to declare an additional military conflict this phase`)
            .max(AbilityDsl.limit.perPhase(1));
    }
}


export default HidaOUshi;
