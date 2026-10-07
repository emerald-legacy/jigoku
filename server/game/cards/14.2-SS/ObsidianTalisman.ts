import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { unlimited } from '../../AbilityLimit.js';
import { discardStatusToken, selectToken } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class ObsidianTalisman extends DrawCard {
    static id = 'obsidian-talisman';

    setupCardAbilities() {
        this.action('Discard attached character\'s token')
            .cost(costs.payHonor(1))
            .condition(context => !!context.source.parentCharacter)
            .gameAction(selectToken(context => ({
                card: context.source.parentCharacter ?? undefined,
                activePromptTitle: 'Which token do you wish to discard?',
                message: '{0} discards {1}',
                messageArgs: (token, player) => [player, token],
                gameAction: discardStatusToken()
            })))
            .effect((context) => msg`discard a status token from ${context.source.parentCharacter}`)
            .limit(unlimited());
    }
}


export default ObsidianTalisman;


