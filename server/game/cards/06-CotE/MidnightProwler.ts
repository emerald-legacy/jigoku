import { Location } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class MidnightProwler extends DrawCard {
    static id = 'midnight-prowler';

    public setupCardAbilities() {
        this.reaction('Look at the top two cards of your opponent\'s conflict deck')
            .when({
                afterConflict: (event, context) =>
                    this.game.isDuringConflict('military') &&
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent !== undefined
            })
            .handler((context) => {
                const opponent = context.player.opponent;
                if(!opponent) {
                    return;
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Which card do you want to discard?',
                    context: context,
                    cards: opponent.conflictDeck.slice(0, 2),
                    options: [{ text: 'Do not discard either card.', handler: () => true }],
                    cardHandler: (card) => {
                        opponent.moveCard(card, Location.ConflictDiscardPile);
                        context.game.addMessage('{0} chooses to discard {1}', context.player, card);
                    }
                });
            });
    }
}
