import fs from 'fs';
import path from 'path';
import { Element, Trait, elementTrait } from '../../server/game/Constants.js';

const PathToCards = path.join(process.cwd(), 'test/json/Card');

describe('Trait', function() {
    it('has a member for every trait in the card data', function() {
        const known = new Set<string>(Object.values(Trait));
        const missing = new Set<string>();
        for(const file of fs.readdirSync(PathToCards).filter((name) => name.endsWith('.json'))) {
            const cards: { traits?: string[] | null }[] = JSON.parse(fs.readFileSync(path.join(PathToCards, file), 'utf-8'));
            for(const trait of cards.flatMap((card) => card.traits ?? [])) {
                if(!known.has(trait)) {
                    missing.add(trait);
                }
            }
        }

        expect([...missing].sort()).toEqual([]);
    });

    it('names Emerald Legacy\'s Corrupt and Foreign after the traits the card data holds', function() {
        expect(Trait.Corrupt).toBe(Trait.Shadowlands);
        expect(Trait.Foreign).toBe(Trait.Gaijin);
    });

    it('maps every element to the trait of the same name', function() {
        for(const element of Object.values(Element)) {
            expect(elementTrait(element)).toBe(element);
        }
    });
});
