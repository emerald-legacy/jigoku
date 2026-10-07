import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { gainHonor } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class HallOfVictories extends DrawCard {
    static id = 'hall-of-victories';

    setupCardAbilities() {
        this.forcedReaction('Gain an honor')
            .when({
                afterConflict: (event) => !!event.conflict.winner
            })
            .gameAction(gainHonor(context => ({
                target: context.game.currentConflict?.winner ?? undefined
            })))
            .effect((context) => msg`make ${context.game.currentConflict?.winner?.name ?? ''} gain 1 honor`)
            .limit(unlimitedPerConflict());
    }
}


export default HallOfVictories;
