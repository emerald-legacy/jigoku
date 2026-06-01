import { PlayerZones } from '../../build/server/game/PlayerZones.js';
import { Locations } from '../../build/server/game/Constants.js';

describe('PlayerZones', function () {
    beforeEach(function () {
        this.zones = new PlayerZones();
    });

    describe('getSourceList', function () {
        it('returns the backing array for a known location', function () {
            const card = { uuid: 'h1' };
            this.zones.hand.push(card);
            expect(this.zones.getSourceList(Locations.Hand)).toBe(this.zones.hand);
        });

        it('concatenates every province for the Provinces location', function () {
            const p1 = { uuid: 'p1' };
            const sh = { uuid: 'sh' };
            this.zones.provinceOne.push(p1);
            this.zones.strongholdProvince.push(sh);
            const result = this.zones.getSourceList(Locations.Provinces);
            expect(result).toContain(p1);
            expect(result).toContain(sh);
        });

        it('lazily creates and returns an additional pile for an unknown source', function () {
            const result = this.zones.getSourceList('customPile');
            expect(result).toEqual([]);
            expect(this.zones.additionalPiles.customPile).toBeDefined();
        });

        it('returns an empty array for an empty source name', function () {
            expect(this.zones.getSourceList('')).toEqual([]);
        });
    });

    describe('updateSourceList', function () {
        it('replaces the backing array for a known location', function () {
            const newHand = [{ uuid: 'x' }];
            this.zones.updateSourceList(Locations.Hand, newHand);
            expect(this.zones.hand).toBe(newHand);
        });

        it('replaces the cards of an existing additional pile', function () {
            this.zones.createAdditionalPile('customPile');
            const cards = [{ uuid: 'y' }];
            this.zones.updateSourceList('customPile', cards);
            expect(this.zones.additionalPiles.customPile.cards).toBe(cards);
        });
    });

    describe('createAdditionalPile', function () {
        it('creates a pile with an empty card list and merges extra properties', function () {
            this.zones.createAdditionalPile('customPile', { isPrivate: true });
            expect(this.zones.additionalPiles.customPile.cards).toEqual([]);
            expect(this.zones.additionalPiles.customPile.isPrivate).toBe(true);
        });
    });

    describe('province lookups', function () {
        beforeEach(function () {
            this.dynastyCard = { uuid: 'd', isDynasty: true, isProvince: false };
            this.provinceCard = { uuid: 'pr', isDynasty: false, isProvince: true };
            this.zones.provinceOne.push(this.provinceCard, this.dynastyCard);
        });

        it('finds the dynasty card in a province', function () {
            expect(this.zones.getDynastyCardInProvince(Locations.ProvinceOne)).toBe(this.dynastyCard);
        });

        it('returns all dynasty cards in a province', function () {
            expect(this.zones.getDynastyCardsInProvince(Locations.ProvinceOne)).toEqual([this.dynastyCard]);
        });

        it('finds the province card in a province', function () {
            expect(this.zones.getProvinceCardInProvince(Locations.ProvinceOne)).toBe(this.provinceCard);
        });
    });
});
