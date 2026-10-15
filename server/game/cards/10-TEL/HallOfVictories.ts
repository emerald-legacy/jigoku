import DrawCard from '../../DrawCard.js';
import { unlimited } from '../../AbilityLimit.js';
import { msg } from '../../GameChat.js';

class HallOfVictories extends DrawCard {
    static id = 'hall-of-victories';

    setupCardAbilities() {
        this.forcedReaction('Gain an honor')
            .when({
                afterConflict: (event) => !!event.conflict.winner
            })
            .gainHonor((context) => ({
                target: context.game.currentConflict?.winner ?? undefined
            }))
            .chatText((context) => msg`make ${context.game.currentConflict?.winner?.name ?? ''} gain 1 honor`)
            .limit(unlimited());
    }
}


export default HallOfVictories;
