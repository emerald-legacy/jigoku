import DrawCard from '../../DrawCard.js';
import { perPhase } from '../../AbilityLimit.js';
import { additionalConflict } from '../../effects.js';
import { Duration, ConflictType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class HidaOUshi extends DrawCard {
    static id = 'hida-o-ushi';

    setupCardAbilities() {
        this.reaction('Gain additional military conflict')
            .when({ afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player })
            .playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Military)
            }))
            .chatText((context) => msg`allow ${context.player} to declare an additional military conflict this phase`)
            .max(perPhase(1));
    }
}


export default HidaOUshi;
