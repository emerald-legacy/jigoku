import BaseCard from '../../../server/game/BaseCard.js';
import DrawCard from '../../../server/game/DrawCard.js';
import type { CardData } from '../../../server/game/types/CardData.js';

function makeGame() {
    const game = jasmine.createSpyObj('game', [
        'raiseEvent',
        'getCurrentAbilityContext',
        'getFrameworkContext',
        'on',
        'removeListener'
    ]);
    game.getFrameworkContext.and.returnValue(null);
    return game;
}

function makeOwner(game: ReturnType<typeof makeGame>) {
    const owner = jasmine.createSpyObj('owner', [
        'getCardSelectionState',
        'allowGameAction',
        'getShortSummary',
        'checkRestrictions'
    ]);
    owner.getCardSelectionState.and.returnValue({});
    owner.allowGameAction.and.returnValue(true);
    owner.checkRestrictions.and.returnValue(true);
    owner.game = game;
    return owner;
}

const minimalCardData: CardData = {
    id: 'test-card',
    name: 'Test Card',
    type: 'character',
    faction: 'crab',
    side: 'conflict',
    traits: [],
    text: ''
};

const minimalDrawCardData: CardData = {
    ...minimalCardData,
    cost: '2',
    military: '3',
    political: '1',
    glory: '1',
    strength_bonus: null
};

describe('CardData field extraction', function() {
    let game: ReturnType<typeof makeGame>;
    let owner: ReturnType<typeof makeOwner>;

    beforeEach(function() {
        game = makeGame();
        owner = makeOwner(game);
    });

    describe('BaseCard', function() {
        describe('id', function() {
            it('reads id from cardData.id', function() {
                const card = new BaseCard(owner, { ...minimalCardData, id: 'my-card-id' });
                expect(card.id).toBe('my-card-id');
            });
        });

        describe('name', function() {
            it('reads printedName from cardData.name', function() {
                const card = new BaseCard(owner, { ...minimalCardData, name: 'Akodo Toturi' });
                expect(card.printedName).toBe('Akodo Toturi');
            });
        });

        describe('faction', function() {
            it('reads printedFaction from cardData.faction', function() {
                const card = new BaseCard(owner, { ...minimalCardData, faction: 'lion' });
                expect(card.printedFaction).toBe('lion');
            });

            it('reads printedFaction from cardData.clan for legacy data', function() {
                const data: CardData = { ...minimalCardData, clan: 'dragon' };
                delete data.faction;
                const card = new BaseCard(owner, data);
                expect(card.printedFaction).toBe('dragon');
            });

            it('prefers clan over faction when both present (legacy precedence)', function() {
                const card = new BaseCard(owner, { ...minimalCardData, faction: 'scorpion', clan: 'crab' });
                expect(card.printedFaction).toBe('crab');
            });
        });

        describe('traits', function() {
            it('reads traits array from cardData.traits', function() {
                const card = new BaseCard(owner, { ...minimalCardData, traits: ['bushi', 'samurai'] });
                expect(card.traits).toEqual(['bushi', 'samurai']);
            });

            it('defaults traits to empty array when absent', function() {
                const data: CardData = { ...minimalCardData };
                delete data.traits;
                const card = new BaseCard(owner, data);
                expect(card.traits).toEqual([]);
            });
        });

        describe('text / keywords', function() {
            it('parses keywords from cardData.text', function() {
                const card = new BaseCard(owner, { ...minimalCardData, text: 'Ancestral.' });
                expect(card.hasPrintedKeyword('ancestral')).toBe(true);
            });

            it('handles absent text without throwing', function() {
                const data: CardData = { ...minimalCardData };
                delete data.text;
                expect(() => new BaseCard(owner, data)).not.toThrow();
            });
        });
    });

    describe('DrawCard', function() {
        describe('side', function() {
            it('sets isConflict=true and isDynasty=false for side "conflict"', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, side: 'conflict' });
                expect(card.isConflict).toBe(true);
                expect(card.isDynasty).toBe(false);
            });

            it('sets isDynasty=true and isConflict=false for side "dynasty"', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, side: 'dynasty' });
                expect(card.isDynasty).toBe(true);
                expect(card.isConflict).toBe(false);
            });
        });

        describe('military skill', function() {
            it('parses printedMilitarySkill from cardData.military string', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, military: '4' });
                expect(card.printedMilitarySkill).toBe(4);
            });

            it('returns NaN when cardData.military is null', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, military: null });
                expect(card.printedMilitarySkill).toBeNaN();
            });

            it('returns NaN when cardData.military is undefined', function() {
                const data: CardData = { ...minimalDrawCardData };
                delete data.military;
                const card = new DrawCard(owner, data);
                expect(card.printedMilitarySkill).toBeNaN();
            });
        });

        describe('political skill', function() {
            it('parses printedPoliticalSkill from cardData.political string', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, political: '2' });
                expect(card.printedPoliticalSkill).toBe(2);
            });

            it('returns NaN when cardData.political is null', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, political: null });
                expect(card.printedPoliticalSkill).toBeNaN();
            });
        });

        describe('cost', function() {
            it('parses printedCost from cardData.cost string', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, cost: '3' });
                expect(card.printedCost).toBe(3);
            });

            it('sets printedCost to 0 for events with no cost', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, type: 'event', cost: null });
                expect(card.printedCost).toBe(0);
            });

            it('sets printedCost to null for non-event cards with no cost', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, type: 'holding', cost: null });
                expect(card.printedCost).toBeNull();
            });
        });

        describe('glory', function() {
            it('parses printedGlory from cardData.glory string', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, glory: '2' });
                expect(card.printedGlory).toBe(2);
            });

            it('results in NaN when cardData.glory is null', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, glory: null });
                expect(card.printedGlory).toBeNaN();
            });
        });

        describe('strength_bonus', function() {
            it('parses printedStrengthBonus from cardData.strength_bonus string', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, strength_bonus: '1' });
                expect(card.printedStrengthBonus).toBe(1);
            });

            it('results in NaN when cardData.strength_bonus is null', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, strength_bonus: null });
                expect(card.printedStrengthBonus).toBeNaN();
            });
        });

        describe('attachment_allow_duplicates', function() {
            it('sets allowDuplicatesOfAttachment from cardData.attachment_allow_duplicates', function() {
                const card = new DrawCard(owner, { ...minimalDrawCardData, attachment_allow_duplicates: true });
                expect(card.allowDuplicatesOfAttachment).toBe(true);
            });

            it('defaults allowDuplicatesOfAttachment to false when absent', function() {
                const card = new DrawCard(owner, minimalDrawCardData);
                expect(card.allowDuplicatesOfAttachment).toBe(false);
            });
        });
    });
});
