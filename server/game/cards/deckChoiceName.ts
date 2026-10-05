import type Player from '../Player.js';

export type DeckChoice = 'MyDynasty' | 'MyConflict' | 'OppDynasty' | 'OppConflict';

/** The label of a choice between the owner's and their opponent's dynasty or conflict deck, 'N/A' for an opponent's in a solo game. */
export function deckChoiceName(owner: Player, key: DeckChoice): string {
    if(key === 'MyDynasty') {
        return `${owner.name}'s Dynasty`;
    }
    if(key === 'MyConflict') {
        return `${owner.name}'s Conflict`;
    }
    if(owner.opponent) {
        if(key === 'OppDynasty') {
            return `${owner.opponent.name}'s Dynasty`;
        }
        if(key === 'OppConflict') {
            return `${owner.opponent.name}'s Conflict`;
        }
    }

    return 'N/A';
}
