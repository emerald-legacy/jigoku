import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ObstinateRecruit extends DrawCard {
    static id = 'obstinate-recruit';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  (context: any) => context.player.opponent && context.player.opponent.isMoreHonorable(),
                message: '{0} is discarded from play as its controller has less honor',
                messageArgs: (context: any) => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });
    }
}


export default ObstinateRecruit;
