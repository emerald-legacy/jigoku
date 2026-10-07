import * as costs from '../../../costs/index.js';
import { discardStatusToken, selectToken } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class SoshiIllusionist extends DrawCard {
    static id = 'soshi-illusionist';

    setupCardAbilities() {
        this.action('Discard status from character')
            .cost(costs.payFate(1))
            .target({
                cardType: CardType.Character
            }, selectToken((context) => ({
                card: context.target,
                activePromptTitle: 'Which token do you wish to discard?',
                message: '{0} discards {1}',
                messageArgs: (token, player) => [player, token],
                gameAction: discardStatusToken()
            })))
            .effect('discard a status token from {0}');
    }
}
