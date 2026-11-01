import { msg, type MessageArgs } from '../../GameChat.js';
import { Location } from '../../Constants.js';
import type DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { MulliganPrompt } from './MulliganPrompt.js';

export class MulliganConflictPrompt extends MulliganPrompt {
    protected override readonly deckName = 'Conflict';

    protected override hasDecided(player: Player): boolean {
        return !!player.takenConflictMulligan;
    }

    protected override markDecided(player: Player): void {
        player.takenConflictMulligan = true;
    }

    protected override mulliganableCards(player: Player): DrawCard[] {
        return player.hand.slice();
    }

    protected override mulligan(player: Player, cards: DrawCard[]): MessageArgs {
        for(const card of cards) {
            player.moveCard(card, Location.ConflictDeck, { bottom: true });
        }
        player.drawCardsToHand(cards.length);
        player.shuffleConflictDeck();
        return msg`${player} has mulliganed ${cards.length} cards from the conflict deck`;
    }

    protected override keptMessage(player: Player): MessageArgs {
        return msg`${player} has kept all conflict cards`;
    }
}
