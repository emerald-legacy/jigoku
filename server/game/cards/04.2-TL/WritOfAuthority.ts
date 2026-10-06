import DrawCard from '../../DrawCard.js';
import { delayedEffect } from '../../effects.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class WritOfAuthority extends DrawCard {
    static id = 'writ-of-authority';

    setupCardAbilities() {
        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => !!context.player.opponent && context.player.opponent.isMoreHonorable(),
                message: '{0} is discarded from play as its controller has less honor',
                messageArgs: (context) => [context.source],
                gameAction: discardFromPlay()
            })
        });
    }
}


export default WritOfAuthority;
