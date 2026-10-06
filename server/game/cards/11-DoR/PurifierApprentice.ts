import DrawCard from '../../DrawCard.js';
import { loseHonor } from '../../GameActions/GameActions.js';

class PurifierApprentice extends DrawCard {
    static id = 'purifier-apprentice';

    setupCardAbilities() {
        this.reaction('Force opponent to lose 1 honor')
            .when({ afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player })
            .gameAction(loseHonor((context) => ({ target: context.player.opponent })));
    }
}


export default PurifierApprentice;
