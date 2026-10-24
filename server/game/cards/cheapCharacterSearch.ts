import { CardType, DeckType, RemainingCards } from '../Constants.js';
import type { DeckSearchProperties } from '../GameActions/DeckSearchAction.js';
import { putIntoPlay } from '../GameActions/GameActions.js';
import { msg } from '../GameChat.js';

/** Look at the top 5 cards of your dynasty deck, you may put a character with cost 2 or lower into play, discard the rest. */
export function cheapCharacterSearch(): DeckSearchProperties {
    return {
        activePromptTitle: 'Choose a character to put into play',
        cardsToLookAt: 5,
        deck: DeckType.Dynasty,
        cardCondition: (card) => card.type === CardType.Character && card.costAtMost(2),
        remainingCards: RemainingCards.Discard,
        message: (context, cards) => msg`${context.player} puts ${cards} into play`,
        gameAction: putIntoPlay()
    };
}
