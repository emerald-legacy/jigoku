import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { discardCard, rearrangeDeck } from '../../GameActions/GameActions.js';
import { TargetMode } from '../../Constants.js';

class ShojusDiviner extends DrawCard {
    static id = 'shoju-s-diviner';

    setupCardAbilities() {
        this.dire({
            effect: gainAbility.action('Divine your conflict deck', (ability) => ability
                .deckSearch({
                    cardsToLookAt: 8,
                    mode: TargetMode.Unlimited,
                    reveal: false,
                    activePromptTitle: 'Select the cards to discard',
                    doneButtonText: 'Done',
                    gameAction: discardCard(),
                    message: (context, cards) => msg`${context.player} discards ${cards}`,
                    takesNothingMessage: () => undefined,
                    remainingCardsHandler: (context, _event, cards) => cards.length > 0 && rearrangeDeck({
                        cards,
                        message: (context, ordered) => msg`${context.player} places ${ordered.length} card${ordered.length > 1 ? 's' : ''} on top of their deck`
                    }).resolve(context.player, context)
                })
                .chatText('look at the top 8 cards of their conflict deck'))
        });
    }
}


export default ShojusDiviner;
