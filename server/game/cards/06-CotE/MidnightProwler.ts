import DrawCard from '../../drawcard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

export default class MidnightProwler extends DrawCard {
    static id = 'midnight-prowler';

    public setupCardAbilities() {
        this.reaction({
            title: 'Look at the top two card of your opponents conflict deck.',
            when: {
                afterConflict: (event: any, context: TriggeredAbilityContext) =>
                    this.game.isDuringConflict('military') &&
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent !== undefined
            },
            handler: (context?: TriggeredAbilityContext) => {
                if(!context || !context.player.opponent) {
                    return;
                }
                const opponent = context.player.opponent;
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Which card do you want to discard?',
                    context: context,
                    cards: opponent.conflictDeck.slice(0, 2),
                    choices: ['Do not discard either card.'],
                    handlers: [() => true],
                    cardHandler: (card: DrawCard) => {
                        opponent.moveCard(card, 'conflict discard pile');
                        context.game.addMessage('{0} chooses to discard {1}', context.player, card);
                    }
                });
            }
        });
    }
}
