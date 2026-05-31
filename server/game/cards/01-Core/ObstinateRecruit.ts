import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class ObstinateRecruit extends DrawCard {
    static id = 'obstinate-recruit';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  (context: AbilityContext) => context.player.opponent && context.player.opponent.isMoreHonorable(),
                message: '{0} is discarded from play as its controller has less honor',
                messageArgs: (context: AbilityContext) => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });
    }
}


export default ObstinateRecruit;
