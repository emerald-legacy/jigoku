import fs from 'fs';
import path from 'path';
import { cards } from '../../../server/game/cards/index.js';
import DrawCard from '../../../server/game/DrawCard.js';
import { ProvinceCard } from '../../../server/game/ProvinceCard.js';
import { RoleCard } from '../../../server/game/RoleCard.js';
import { StrongholdCard } from '../../../server/game/StrongholdCard.js';
import type BaseCard from '../../../server/game/BaseCard.js';
import type { CardData } from '../../../server/game/types/CardData.js';

type AnyCardClass = abstract new (...args: never[]) => BaseCard;

// The base class Deck.prepare requires for a card of this kind; undefined for kinds a deck doesn't hold.
function deckBaseFor(card: CardData): AnyCardClass | undefined {
    if(card.side === 'conflict' || card.side === 'dynasty') {
        return DrawCard;
    }
    switch(card.type) {
        case 'province':
            return ProvinceCard;
        case 'stronghold':
            return StrongholdCard;
        case 'role':
            return RoleCard;
    }
    return undefined;
}

describe('Card implementations', function() {
    const directory = path.join(process.cwd(), 'test/json/Card');
    const cardData: CardData[] = fs.readdirSync(directory)
        .filter((file) => file.endsWith('.json'))
        .flatMap((file) => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')));

    it('extend the base class their deck section builds', function() {
        const mismatched = cardData.flatMap((card) => {
            const Implementation = cards.get(card.id);
            const base = deckBaseFor(card);
            return Implementation && base && !(Implementation.prototype instanceof base) ? [card.id] : [];
        });
        expect(mismatched).toEqual([]);
    });
});
