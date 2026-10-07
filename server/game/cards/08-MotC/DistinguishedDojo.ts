import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';
import { addToken, gainHonor, sacrifice } from '../../GameActions/GameActions.js';
import { TokenType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { msg } from '../../GameChat.js';
import { stateWhenLeftPlay } from '../stateWhenLeftPlay.js';

/** One honor for each honor token on the dōjō when it was sacrificed. */
function honorTokens(context: AbilityContext) {
    return stateWhenLeftPlay(context)?.getTokenCount(TokenType.Honor) ?? 0;
}

class DistinguishedDojo extends DrawCard {
    static id = 'distinguished-dojo';

    setupCardAbilities() {
        this.reaction('Place an honor token')
            .when({
                afterDuel: (event, context) => {
                    if(!event.winningPlayer) {
                        return false;
                    }
                    if(Array.isArray(event.winningPlayer)) {
                        return event.winningPlayer.some((player) => player === context.player);
                    }
                    return event.winningPlayer === context.player;
                }
            })
            .gameAction(addToken())
            .limit(perRound(3))
            .then()
            .select({ activePromptTitle: 'Sacrifice ' + this.name + '?' }, {
                Yes: sacrifice((context) => ({ target: context.source })),
                No: () => true
            })
            .message((context) => msg`${context.player} chooses ${context.select === 'No' ? 'not ' : ''}to sacrifice ${context.source}`)
            .then()
            .gameAction(gainHonor((context) => ({ amount: honorTokens(context) })))
            .message((context) => msg`${context.player} uses ${context.source} to gain ${honorTokens(context)} honor`);
    }
}


export default DistinguishedDojo;
