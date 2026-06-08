import { ThrivingAbility } from '../../../build/server/game/KeywordAbilities/ThrivingAbility.js';
import { Phases } from '../../../build/server/game/Constants.js';

describe('ThrivingAbility', function() {
    let card, ability;

    beforeEach(function() {
        const game = jasmine.createSpyObj('game', ['on']);
        card = jasmine.createSpyObj('card', ['getType'], { name: 'Test Holding', game: game });
        card.getType.and.returnValue('holding');
        ability = new ThrivingAbility(card);
    });

    describe('the onPhaseEnded trigger', function() {
        let source, player, context, event;

        beforeEach(function() {
            source = jasmine.createSpyObj('source', ['hasThriving']);
            source.hasThriving.and.returnValue(true);
            source.location = 'province 1';
            player = jasmine.createSpyObj('player', ['getDynastyCardsInProvince']);
            player.getDynastyCardsInProvince.and.returnValue([{}]);
            context = { source: source, player: player };
            event = { phase: Phases.Fate };
        });

        it('triggers in the fate phase when thriving with exactly one dynasty card', function() {
            expect(ability.when.onPhaseEnded(event, context)).toBe(true);
        });

        it('does not trigger outside the fate phase', function() {
            event.phase = Phases.Conflict;
            expect(ability.when.onPhaseEnded(event, context)).toBeFalsy();
        });

        it('does not trigger when the source is not thriving', function() {
            source.hasThriving.and.returnValue(false);
            expect(ability.when.onPhaseEnded(event, context)).toBeFalsy();
        });

        it('does not trigger when the province does not hold exactly one dynasty card', function() {
            player.getDynastyCardsInProvince.and.returnValue([{}, {}]);
            expect(ability.when.onPhaseEnded(event, context)).toBeFalsy();
        });

        it('counts the dynasty cards in the source location', function() {
            ability.when.onPhaseEnded(event, context);
            expect(player.getDynastyCardsInProvince).toHaveBeenCalledWith('province 1');
        });
    });

    describe('the handler', function() {
        it('places the top dynasty card faceup in the source location', function() {
            const player = jasmine.createSpyObj('player', ['putTopDynastyCardInProvince']);
            ability.handler({ source: { location: 'province 3' }, player: player });
            expect(player.putTopDynastyCardInProvince).toHaveBeenCalledWith('province 3', true);
        });
    });
});
