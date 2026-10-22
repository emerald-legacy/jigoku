import type { CardType } from '../Constants.js';

/** "Choose 2 characters", "Select up to 3 cards": the card type when there is just one. */
export function countPromptTitle(cardType: (CardType | undefined)[], count: number, upTo: boolean): string {
    const type = cardType.length === 1 && cardType[0] ? cardType[0] : 'card';
    const verb = upTo || type === 'card' ? 'Select' : 'Choose';
    if(count === 1) {
        return `${verb} a ${type}`;
    }
    return `${verb} ${upTo ? 'up to ' : ''}${count} ${type}s`;
}
