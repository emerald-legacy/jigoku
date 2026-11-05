const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** "top 3 cards" for chat, capped by the cards in the deck: "top card" for one. `inWords` spells the number ("top two cards"). */
export function topCards(count: number, inDeck: number, inWords = false): string {
    const amount = Math.min(count, inDeck);
    if(amount === 1) {
        return 'top card';
    }
    return `top ${inWords ? numberWords[amount] ?? String(amount) : String(amount)} cards`;
}
