import DrawCard from '../../../drawcard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
import { EventNames } from '../../../Constants.js';
export default class BayushiTruthseeker extends DrawCard {
    static id = 'bayushi-truthseeker';

    public setupCardAbilities() {
        this.reaction({
            title: 'Look at the top two card of your opponents conflict deck',
            when: {
                afterConflict: (event: EventPayload<EventNames.AfterConflict>, context: TriggeredAbilityContext) =>
                    context.player.opponent !== undefined &&
                    event.conflict.winner === context.source.controller &&
                    context.source.isAttacking()
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
