import AbilityDsl from '../abilitydsl.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import { shuffle } from '../utils/shuffle.js';

/** `amount` random cards from the player's hand, sorted by name. */
export function randomHandCards(player: Player | undefined, amount: number): DrawCard[] {
    return shuffle(player?.hand ?? []).slice(0, amount).sort((a, b) => a.name.localeCompare(b.name));
}

/** A card menu for the ability's player to choose one of `cards` to discard. */
export function chooseCardToDiscard(cards: DrawCard[]) {
    return AbilityDsl.actions.cardMenu((context) => ({
        cards,
        targets: true,
        message: '{0} chooses {1} to be discarded',
        messageArgs: (card) => [context.player, card],
        gameAction: AbilityDsl.actions.discardCard()
    }));
}
