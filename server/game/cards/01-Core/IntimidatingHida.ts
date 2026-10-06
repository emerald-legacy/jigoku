import DrawCard from '../../DrawCard.js';
import { loseHonor } from '../../GameActions/GameActions.js';

class IntimidatingHida extends DrawCard {
    static id = 'intimidating-hida';

    setupCardAbilities() {
        this.reaction('Make opponent lose honor')
            .when({
                onConflictPass: (event, context) => event.conflict.attackingPlayer === context.player.opponent
            })
            .gameAction(loseHonor((context) => ({ target: context.player.opponent })));
    }
}


export default IntimidatingHida;
