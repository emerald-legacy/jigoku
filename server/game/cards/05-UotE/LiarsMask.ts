import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class LiarsMask extends DrawCard {
    static id = 'liar-s-mask';

    setupCardAbilities() {
        this.action({
            title: 'Discard status token from attached character',
            condition: (context: AbilityContext) => !!(context.source as DrawCard).parent,
            gameAction: AbilityDsl.actions.selectToken((context: AbilityContext) => ({
                card: (context.source as DrawCard).parent as DrawCard,
                activePromptTitle: 'Which token do you wish to discard?',
                message: '{0} discards {1}',
                messageArgs: (token, player) => [player, token],
                gameAction: AbilityDsl.actions.discardStatusToken()
            })),
            effect: 'discard a status token from {1}',
            effectArgs: (context: AbilityContext) => [(context.source as DrawCard).parent as DrawCard]
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
