import { Location } from '../../../Constants.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardMenu, lookAt, moveCard, sequential, shuffleDeck } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class PatronOfTheTradingCouncil extends DrawCard {
    static id = 'patron-of-the-trading-council';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                (context.game.currentConflict?.getNumberOfParticipants((card) =>
                    card.hasTrait('mantis-clan')
                ) ?? 0) > 0,
            effect: modifyBothSkills(1)
        });

        this.action('Give each player a valuable good')
            .gameAction(sequential([
                lookAt((context) => ({
                    target: context.player.conflictDeck.slice(0, 2),
                    message: '{0} reveals the top {1} from their conflict deck: {2}',
                    messageArgs: (cards) => [context.player, cards.length, cards]
                })),
                lookAt((context) => ({
                    target: context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 2) : [],
                    message: '{0} reveals the top {1} from their conflict deck: {2}',
                    messageArgs: (cards) => [context.player.opponent, cards.length, cards]
                })),
                cardMenu((context) => ({
                    activePromptTitle: 'Choose a card to give to yourself',
                    cards: context.player.conflictDeck.slice(0, 2),
                    targets: true,
                    message: '{0} chooses {1} to give to {2}',
                    messageArgs: (card, player) => [player, card, context.player],
                    gameAction: moveCard({ destination: Location.Hand })
                })),
                cardMenu((context) => ({
                    activePromptTitle: 'Choose a card to give your opponent',
                    cards: context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 2) : [],
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
            .chatText('give each player a valuable good');
    }
}
