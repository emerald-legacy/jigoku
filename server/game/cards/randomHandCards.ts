import { cardMenu, discardCard } from '../GameActions/GameActions.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { shuffle } from '../utils/random.js';

export function randomHandCards(player: Player | undefined, amount: number): DrawCard[] {
    return shuffle(player?.hand ?? []).slice(0, amount).sort((a, b) => a.name.localeCompare(b.name));
}

export function chooseCardToDiscard(cards: DrawCard[]) {
    return cardMenu((context) => ({
        cards,
        targets: true,
        message: '{0} chooses {1} to be discarded',
        messageArgs: (card) => [context.player, card],
        gameAction: discardCard()
    }));
}
