import { Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

export default class BayushiTruthseeker extends DrawCard {
    static id = 'bayushi-truthseeker';

    public override setupCardAbilities() {
        this.reaction('Look at the top two cards of your opponent\'s conflict deck')
            .when({
                afterConflict: (event, context) =>
                    context.player.opponent !== undefined &&
                    event.conflict.isOnWinningSide(context.source) &&
                    context.source.isAttacking()
            })
            .cardMenu((context) => ({
                activePromptTitle: 'Which card do you want to discard?',
                cards: context.player.opponent?.conflictDeck.slice(0, 2) ?? [],
                options: [{ text: 'Do not discard either card', handler: () => true }],
                gameAction: moveCard({ destination: Location.ConflictDiscardPile }),
                message: (_context, card, player) => msg`${player} chooses to discard ${card}`
            }))
            .chatText((context) => msg`look at the top two cards of ${context.player.opponent}'s conflict deck`);
    }
}
