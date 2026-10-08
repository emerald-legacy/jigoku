import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';
import { cardMenu, discardCard, lookAt } from '../../GameActions/GameActions.js';
import { ConflictType } from '../../Constants.js';

class KitsukiInvestigator extends DrawCard {
    static id = 'kitsuki-investigator';

    setupCardAbilities() {
        this.action('Look at opponent\'s hand')
            .cost(costs.payFateToRing())
            .condition((context) => context.source.isParticipating() && this.game.isDuringConflict(ConflictType.Political) &&
                                  !!context.player.opponent && context.player.opponent.hand.length > 0)
            .gameAction(lookAt((context) => ({
                target: context.player.opponent?.hand.slice().sort((a, b) => a.name.localeCompare(b.name))
            })), cardMenu((context) => ({
                cards: context.player.opponent?.hand.slice().sort((a, b) => a.name.localeCompare(b.name)) ?? [],
                targets: true,
                message: (context, card) => msg`${context.player} chooses ${card} to be discarded`,
                gameAction: discardCard()
            })))
            .chatText('reveal {1}\'s hand and discard a card from it', (context) => context.player.opponent ?? context.player)
            .max(perConflict(1));
    }
}


export default KitsukiInvestigator;
