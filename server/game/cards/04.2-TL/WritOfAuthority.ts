import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { delayedEffect } from '../../effects.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class WritOfAuthority extends DrawCard {
    static id = 'writ-of-authority';

    setupCardAbilities() {
        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => !!context.player.opponent && context.player.opponent.isMoreHonorable(),
                message: (context) => msg`${context.source} is discarded from play as its controller has less honor`,
                gameAction: discardFromPlay()
            })
        });
    }
}


export default WritOfAuthority;
