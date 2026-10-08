import type { AbilityContext } from '../AbilityContext.js';
import { attach } from '../GameActions/GameActions.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { MessageArgs } from '../GameChat.js';

/** Announces `message` and attaches the card a deck search picked to `parent` once the search has finished; nothing if no card was picked. */
export function attachSearchedCard(context: AbilityContext, parent: BaseCard | undefined, card: DrawCard | undefined, message: (card: DrawCard) => MessageArgs): void {
    if(!card) {
        return;
    }

    const [format, args] = message(card);
    context.game.addMessage(format, ...args);
    context.game.queueSimpleStep(() =>
        attach({ target: parent, attachment: card }).resolve(undefined, context)
    );
}
