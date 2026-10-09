import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { discardStatusToken, selectToken } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import type { PlayType } from '../../Constants.js';

class LiarsMask extends DrawCard {
    static id = 'liar-s-mask';

    setupCardAbilities() {
        this.action('Discard status token from attached character')
            .condition((context) => !!context.source.parentCharacter)
            .gameAction(selectToken((context) => ({
                card: context.source.parentCharacter ?? undefined,
                activePromptTitle: 'Which token do you wish to discard?',
                message: (_context, token, player) => msg`${player} discards ${token}`,
                gameAction: discardStatusToken()
            })))
            .chatText((context) => msg`discard a status token from ${context.source.parentCharacter}`);
    }

    canPlay(context: AbilityContext, playType?: PlayType) {
        if(context.player.honor > 6) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default LiarsMask;
