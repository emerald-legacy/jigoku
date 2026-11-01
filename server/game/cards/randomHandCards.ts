import { msg } from '../GameChat.js';
import { cardMenu, discardCard } from '../GameActions/GameActions.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { shuffle } from '../utils/random.js';

export function randomHandCards(player: Player | undefined, amount: number): DrawCard[] {
    return shuffle(player?.hand ?? []).slice(0, amount).sort((a, b) => a.name.localeCompare(b.name));
}

export function chooseCardToDiscard(cards: DrawCard[]) {
    return cardMenu({
        cards,
        targets: true,
        message: (context, card) => msg`${context.player} chooses ${card} to be discarded`,
        gameAction: discardCard()
    });
}
