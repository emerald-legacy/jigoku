import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class LiarsMask extends DrawCard {
    static id = 'liar-s-mask';

    setupCardAbilities() {
        this.action({
            title: 'Discard status token from attached character',
            condition: (context: any) => !!context.source.parent,
            gameAction: AbilityDsl.actions.selectToken((context: any) => ({
                card: context.source.parent,
                activePromptTitle: 'Which token do you wish to discard?',
                message: '{0} discards {1}',
                messageArgs: (token: any, player: any) => [player, token],
                gameAction: AbilityDsl.actions.discardStatusToken()
            })),
            effect: 'discard a status token from {1}',
            effectArgs: (context: any) => [context.source.parent]
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(context.player.honor > 6) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default LiarsMask;
