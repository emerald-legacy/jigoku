import { Location, ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

export default class MidnightProwler extends DrawCard {
    static id = 'midnight-prowler';

    public override setupCardAbilities() {
        this.reaction('Look at the top two cards of your opponent\'s conflict deck')
            .when({
                afterConflict: (event, context) =>
                    this.game.isDuringConflict(ConflictType.Military) &&
                    event.conflict.isOnWinningSide(context.source) &&
                    (context.player.opponent?.conflictDeck.length ?? 0) > 0
            })
            .cardMenu((context) => ({
                activePromptTitle: 'Which card do you want to discard?',
                cards: context.player.opponent?.conflictDeck.slice(0, 2) ?? [],
                options: [{ text: 'Do not discard either card', handler: () => true }],
                gameAction: moveCard({ destination: Location.ConflictDiscardPile }),
                message: (_context, card, player) => msg`${player} chooses to discard ${card}`
            }))
            .chatText((context) => msg`look at the ${topCards(2, context.player.opponent?.conflictDeck.length ?? 0, true)} of ${context.player.opponent}'s conflict deck`);
    }
}
