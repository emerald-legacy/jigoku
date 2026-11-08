import { CardType } from './Constants.js';

/**
 * Which names a "name a card" prompt offers: a name is offered if any card with that title matches.
 * Only narrows the client's list; the engine accepts any name.
 */
export interface CardNameFilter {
    types?: CardType[];
    sides?: ('conflict' | 'dynasty')[];
    unique?: boolean;
}

/** The cards that can be in a hand. */
export const conflictCardNames: CardNameFilter = { sides: ['conflict'] };

/** The cards that can be played, from either deck. */
export const playableCardNames: CardNameFilter = { types: [CardType.Character, CardType.Attachment, CardType.Event] };

export const nonUniqueDynastyCharacterNames: CardNameFilter = { types: [CardType.Character], sides: ['dynasty'], unique: false };
