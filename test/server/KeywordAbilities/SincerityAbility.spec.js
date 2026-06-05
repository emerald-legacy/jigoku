import SincerityAbility from '../../../build/server/game/KeywordAbilities/SincerityAbility.js';

describe('SincerityAbility', function() {
    let card, ability;

    beforeEach(function() {
        const game = jasmine.createSpyObj('game', ['on']);
        card = jasmine.createSpyObj('card', ['getType'], { name: 'Test Character', game: game });
        card.getType.and.returnValue('character');
        ability = new SincerityAbility(card);
    });

    describe('the onCardLeavesPlay trigger', function() {
        let source, context;

        beforeEach(function() {
            source = jasmine.createSpyObj('source', ['hasSincerity']);
            source.hasSincerity.and.returnValue(true);
            context = { source: source, player: { name: 'self' } };
        });

        it('triggers when the leaving card is the source and it has sincerity', function() {
            expect(ability.when.onCardLeavesPlay({ card: source }, context)).toBe(true);
        });

        it('does not trigger when a different card leaves play', function() {
            expect(ability.when.onCardLeavesPlay({ card: { other: true } }, context)).toBeFalsy();
        });

        it('does not trigger when the source lacks sincerity', function() {
            source.hasSincerity.and.returnValue(false);
            expect(ability.when.onCardLeavesPlay({ card: source }, context)).toBeFalsy();
        });
    });

    describe('the handler', function() {
        it('makes the controlling player draw a card', function() {
            const game = jasmine.createSpyObj('game', ['applyGameAction']);
            const player = { name: 'self' };
            const context = { game: game, player: player };
            ability.handler(context);
            expect(game.applyGameAction).toHaveBeenCalledWith(context, { draw: player });
        });
    });
});
