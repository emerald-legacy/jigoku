import PersonalHonorAbility from '../../../build/server/game/KeywordAbilities/PersonalHonorAbility.js';

describe('PersonalHonorAbility', function() {
    let game, card, ability;

    beforeEach(function() {
        game = jasmine.createSpyObj('game', ['on', 'applyGameAction']);
        card = jasmine.createSpyObj('card', ['getType'], { name: 'Test Character', game: game });
        card.getType.and.returnValue('character');
        ability = new PersonalHonorAbility(card);
    });

    function buildSource() {
        const source = jasmine.createSpyObj('source', ['allowGameAction']);
        source.allowGameAction.and.returnValue(true);
        source.isHonored = false;
        source.isDishonored = false;
        return source;
    }

    describe('the onCardLeavesPlay trigger', function() {
        let source, context;

        beforeEach(function() {
            source = buildSource();
            source.isHonored = true;
            context = { source: source, player: { name: 'self' } };
        });

        it('triggers when the honored source leaves play and may be affected by honor', function() {
            expect(ability.when.onCardLeavesPlay({ card: source }, context)).toBe(true);
        });

        it('triggers when the source is dishonored', function() {
            source.isHonored = false;
            source.isDishonored = true;
            expect(ability.when.onCardLeavesPlay({ card: source }, context)).toBe(true);
        });

        it('does not trigger when the source is neither honored nor dishonored', function() {
            source.isHonored = false;
            source.isDishonored = false;
            expect(ability.when.onCardLeavesPlay({ card: source }, context)).toBeFalsy();
        });

        it('does not trigger when the source cannot be affected by honor', function() {
            source.allowGameAction.and.returnValue(false);
            expect(ability.when.onCardLeavesPlay({ card: source }, context)).toBeFalsy();
        });

        it('does not trigger when a different card leaves play', function() {
            expect(ability.when.onCardLeavesPlay({ card: buildSource() }, context)).toBeFalsy();
        });
    });

    describe('the handler', function() {
        it('grants the player honor when the source is honored', function() {
            const player = { name: 'self' };
            const source = buildSource();
            source.isHonored = true;
            const context = { source: source, player: player };
            ability.handler(context);
            expect(game.applyGameAction).toHaveBeenCalledWith(context, { gainHonor: player });
        });

        it('costs the player honor when the source is dishonored', function() {
            const player = { name: 'self' };
            const source = buildSource();
            source.isDishonored = true;
            const context = { source: source, player: player };
            ability.handler(context);
            expect(game.applyGameAction).toHaveBeenCalledWith(context, { loseHonor: player });
        });
    });
});
