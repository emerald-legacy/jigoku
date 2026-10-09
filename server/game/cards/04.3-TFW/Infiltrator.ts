import { msg } from '../../GameChat.js';
import { PlayType } from '../../Constants.js';
import { chooseAction, discardCard, playCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';

export default class Infiltrator extends DrawCard {
    static id = 'infiltrator';

    setupCardAbilities() {
        this.action('Look at the top card of an opponent\'s deck and play or discard it')
            .condition(() => this.game.isDuringConflict())
            .gameAction(chooseAction((context) => {
                const topCard = context.player.opponent?.conflictDeck[0];
                return {
                    activePromptTitle: topCard && 'Choose an action for ' + topCard.name,
                    choices: {
                        'Play this card': playCard({
                            target: topCard,
                            playType: PlayType.PlayFromHand,
                            source: this
                        }),
                        'Discard this card': {
                            action: discardCard({ target: topCard }),
                            message: (_context, _target, player) => msg`${player} chooses to discard ${topCard}`
                        }
                    }
                };
            }))
            .chatText('look at the top card of an opponent\'s deck and play or discard it');
    }

    canPlay(context: AbilityContext, playType?: PlayType) {
        if(!context.player.opponent || context.player.showBid <= context.player.opponent.showBid) {
            return false;
        }
        return super.canPlay(context, playType);
    }
}
