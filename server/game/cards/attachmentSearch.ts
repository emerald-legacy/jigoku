import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardType, Location, type Players } from '../Constants.js';
import { attach, cardMenu, selectCard, sequential, shuffleDeck } from '../GameActions/GameActions.js';
import { msg } from '../GameChat.js';

interface AttachmentSearchOptions {
    /** Whose characters may receive it. */
    controller: Players;
    maxCost?: number;
}

/** Search the top 5 cards of your conflict deck for an attachment and put it into play attached to a character. Shuffle. */
export function attachmentSearch({ controller, maxCost }: AttachmentSearchOptions) {
    return sequential([
        cardMenu((context) => ({
            activePromptTitle: 'Choose an attachment',
            cards: context.player.conflictDeck.slice(0, 5),
            cardCondition: (card) => card.type === CardType.Attachment && (maxCost === undefined || (card.printedCost ?? 0) <= maxCost),
            options: [
                {
                    text: 'Take nothing',
                    handler: () => {
                        context.game.addMessage(msg`${context.player} takes nothing`);
                        return true;
                    }
                }
            ],
            // the chosen attachment reaches the message through the select's properties
            subActionProperties: (attachment) => ({
                attachment,
                message: (context: AbilityContext, card: BaseCard | BaseCard[]) => msg`${context.player} chooses to attach ${attachment} to ${card}`
            }),
            gameAction: selectCard({
                controller,
                location: Location.PlayArea,
                cardType: CardType.Character,
                gameAction: attach()
            })
        })),
        shuffleDeck((context) => ({
            deck: Location.ConflictDeck,
            target: context.player
        }))
    ]);
}
