import CourtesyAbility from '../../../build/server/game/KeywordAbilities/CourtesyAbility.js';

describe('CourtesyAbility', function() {
    let game, card, ability;

    beforeEach(function() {
        game = jasmine.createSpyObj('game', ['on', 'applyGameAction']);
        card = jasmine.createSpyObj('card', ['getType'], { name: 'Test Character', game: game });
        card.getType.and.returnValue('character');
        ability = new CourtesyAbility(card);
    });

    describe('the onCardLeavesPlay trigger', function() {
        let source, context;

        beforeEach(function() {
            source = jasmine.createSpyObj('source', ['hasCourtesy']);
            source.hasCourtesy.and.returnValue(true);
            context = { source: source, player: { name: 'self' } };
        });

        it('triggers when the leaving card is the source and it has courtesy', function() {
            expect(ability.when.onCardLeavesPlay({ card: source }, context)).toBe(true);
        });

        it('does not trigger when a different card leaves play', function() {
            expect(ability.when.onCardLeavesPlay({ card: { other: true } }, context)).toBeFalsy();
        });

        it('does not trigger when the source lacks courtesy', function() {
            source.hasCourtesy.and.returnValue(false);
            expect(ability.when.onCardLeavesPlay({ card: source }, context)).toBeFalsy();
        });
    });

    describe('the handler', function() {
        it('grants the controlling player a fate', function() {
            const player = { name: 'self' };
            const context = { player: player };
            ability.handler(context);
            expect(game.applyGameAction).toHaveBeenCalledWith(context, { gainFate: player });
        });
    });
});
