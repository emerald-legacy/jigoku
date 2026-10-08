import { Location, ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { cardMenu, moveCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class MidnightProwler extends DrawCard {
    static id = 'midnight-prowler';

    public setupCardAbilities() {
        this.reaction('Look at the top two cards of your opponent\'s conflict deck')
            .when({
                afterConflict: (event, context) =>
                    this.game.isDuringConflict(ConflictType.Military) &&
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent !== undefined
            })
            .gameAction(cardMenu((context) => ({
                activePromptTitle: 'Which card do you want to discard?',
                cards: context.player.opponent?.conflictDeck.slice(0, 2) ?? [],
                options: [{ text: 'Do not discard either card', handler: () => true }],
                gameAction: moveCard({ destination: Location.ConflictDiscardPile }),
                message: '{0} chooses to discard {1}',
                messageArgs: (card, player) => [player, card]
            })))
            .chatText((context) => msg`look at the top two cards of ${context.player.opponent}'s conflict deck`);
    }
}
