import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { cardMenu, lookAt, moveCard, sequential, shuffleDeck } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';

class ThePerfectGift extends DrawCard {
    static id = 'the-perfect-gift';

    setupCardAbilities() {
        this.action('Give each player a gift')
            .gameAction(sequential([
                lookAt((context) => ({
                    target: context.player.conflictDeck.slice(0, 4),
                    message: (context, cards) => msg`${context.player} reveals the top ${cards.length} from their conflict deck: ${cards}`
                })),
                lookAt((context) => ({
                    target: context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 4) : [],
                    message: (context, cards) => msg`${context.player.opponent} reveals the top ${cards.length} from their conflict deck: ${cards}`
                })),
                cardMenu((context) => ({
                    activePromptTitle: 'Choose a card to give to yourself',
                    cards: context.player.conflictDeck.slice(0, 4),
                    targets: true,
                    message: '{0} chooses {1} to give to {2}',
                    messageArgs: (card, player) => [player, card, context.player],
                    gameAction: moveCard({ destination: Location.Hand })
                })),
                cardMenu((context) => ({
                    activePromptTitle: 'Choose a card to give your opponent',
                    cards: context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 4) : [],
                    targets: true,
                    message: '{0} chooses {1} to give to {2}',
                    messageArgs: (card, player) => [player, card, context.player.opponent],
                    gameAction: moveCard({ destination: Location.Hand })
                })),
                shuffleDeck((context) => ({
                    target: context.player,
                    deck: Location.ConflictDeck
                })),
                shuffleDeck((context) => ({
                    target: context.player.opponent || [],
                    deck: Location.ConflictDeck
                }))
            ]))
            .chatText('give each player a gift');
    }
}


export default ThePerfectGift;
