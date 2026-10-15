import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { delayedEffect } from '../../effects.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class ObstinateRecruit extends DrawCard {
    static id = 'obstinate-recruit';

    setupCardAbilities() {
        this.persistentEffect({
            effect: delayedEffect({
                condition:  (context) => context.player.opponent && context.player.opponent.isMoreHonorable(),
                message: (context) => msg`${context.source} is discarded from play as its controller has less honor`,
                gameAction: discardFromPlay()
            })
        });
    }
}


export default ObstinateRecruit;
