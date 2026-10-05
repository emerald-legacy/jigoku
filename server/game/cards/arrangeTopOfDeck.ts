import type { AbilityContext } from '../AbilityContext.js';
import type DrawCard from '../DrawCard.js';

const ORDINALS = ['first', 'second', 'third'];

/** Asks the player to order `cards` one prompt at a time; `putBack` gets them top card first. */
export function arrangeTopOfDeck(context: AbilityContext, cards: DrawCard[], firstTitle: string, putBack: (ordered: DrawCard[]) => void): void {
    const ordered: DrawCard[] = [];

    const chooseNext = (remaining: DrawCard[], title: string) => {
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: title,
            context,
            cards: remaining,
            cardHandler: (card) => {
                ordered.push(card);
                const rest = remaining.filter((c) => c !== card);
                if(rest.length > 1) {
                    chooseNext(rest, 'Which card do you want to be the ' + ORDINALS[ordered.length] + ' card?');
                    return;
                }
                ordered.push(...rest);
                putBack(ordered);
            }
        });
    };

    chooseNext(cards, firstTitle);
}
