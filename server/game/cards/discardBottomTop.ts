import { DeckType, Location } from '../Constants.js';
import { msg } from '../GameChat.js';
import { assignRoles, moveCard, noAction } from '../GameActions/GameActions.js';
import type Player from '../Player.js';

/** "Discard 1 of those cards, place another on top of that deck, and the other on the bottom of that deck." */
export function discardBottomTop(player: Player, deck: DeckType) {
    const isDynasty = deck === DeckType.Dynasty;
    return assignRoles(() => ({
        target: (isDynasty ? player.dynastyDeck : player.conflictDeck).slice(0, 3),
        roles: {
            'discard': moveCard({ destination: isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile }),
            'put on the bottom of the deck': moveCard({ destination: isDynasty ? Location.DynastyDeck : Location.ConflictDeck, bottom: true }),
            'leave on top': noAction()
        },
        pickOrder: ['discard', 'put on the bottom of the deck'],
        messages: {
            'discard': (context, card) => msg`${context.player} chooses to discard ${card}`,
            'put on the bottom of the deck': (context) => msg`${context.player} places a card on the bottom of the deck`
        }
    }));
}
