import { CourtesyAbility } from '../../../build/server/game/KeywordAbilities/CourtesyAbility.js';
import { GainFateAction } from '../../../build/server/game/GameActions/GainFateAction.js';

describe('CourtesyAbility', function() {
    let game, card, ability;

    beforeEach(function() {
        game = jasmine.createSpyObj('game', ['on', 'resolveActions']);
        card = jasmine.createSpyObj('card', ['getType'], { name: 'Test Character', game: game });
        card.getType.and.returnValue('character');
        ability = new CourtesyAbility(card);
    });

    describe('the onCardLeavesPlay trigger', function() {
        let source, leftPlay, context, event;

        beforeEach(function() {
            const player = { name: 'self' };
            source = {};
            leftPlay = jasmine.createSpyObj('leftPlay', ['hasCourtesy'], { controller: player });
            leftPlay.hasCourtesy.and.returnValue(true);
            context = { source: source, player: player };
            event = { card: source, cardStateWhenLeftPlay: leftPlay };
        });

        it('triggers when the leaving card is the source and it had courtesy as it left play', function() {
            expect(ability.when.onCardLeavesPlay(event, context)).toBe(true);
        });

        it('does not trigger when a different card leaves play', function() {
            expect(ability.when.onCardLeavesPlay({ ...event, card: { other: true } }, context)).toBeFalsy();
        });

        it('does not trigger when the source lacked courtesy as it left play', function() {
            leftPlay.hasCourtesy.and.returnValue(false);
            expect(ability.when.onCardLeavesPlay(event, context)).toBeFalsy();
        });

        it('only triggers for the player who controlled the card as it left play', function() {
            expect(ability.when.onCardLeavesPlay(event, { ...context, player: { name: 'other' } })).toBeFalsy();
        });
    });

    describe('the handler', function() {
        it('grants the controlling player a fate', function() {
            const player = { name: 'self' };
            const context = { game: game, player: player };
            ability.handler(context);
            const [actions, resolvedContext] = game.resolveActions.calls.mostRecent().args;
            expect(resolvedContext).toBe(context);
            expect(actions.length).toBe(1);
            expect(actions[0]).toEqual(jasmine.any(GainFateAction));
            expect(actions[0].properties.target).toBe(player);
        });
    });
});
