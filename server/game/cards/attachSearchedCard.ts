import type { AbilityContext } from '../AbilityContext.js';
import AbilityDsl from '../abilitydsl.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { MsgArg } from '../GameChat.js';

/** Announces `message` and attaches the card a deck search picked to `parent` once the search has finished; nothing if no card was picked. */
export function attachSearchedCard(context: AbilityContext, parent: BaseCard | undefined, card: DrawCard | undefined, message: string, messageArgs: (card: DrawCard) => MsgArg[]): void {
    if(!card) {
        return;
    }

    context.game.addMessage(message, ...messageArgs(card));
    context.game.queueSimpleStep(() =>
        AbilityDsl.actions.attach({ target: parent, attachment: card }).resolve(undefined, context)
    );
}
