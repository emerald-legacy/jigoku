import { ConflictTracker } from '../../build/server/game/ConflictTracker.js';
import { Players } from '../../build/server/game/Constants.js';

describe('ConflictTracker', function () {
    beforeEach(function () {
        this.player = { name: 'self', declaredConflictOpportunities: { military: 0, political: 0, passed: 0, forced: 0 } };
        this.opponent = { name: 'opp', declaredConflictOpportunities: { military: 0, political: 0, passed: 0, forced: 0 } };
        this.conflict = {
            attackingPlayer: this.player,
            declaredType: 'military',
            conflictPassed: false,
            forcedDeclaredType: undefined,
            uuid: 'c1',
            winner: undefined,
            conflictTypeSwitched: false
        };
        this.tracker = new ConflictTracker();
    });

    describe('record', function () {
        it('stores a record describing the conflict', function () {
            this.tracker.record(this.conflict);
            expect(this.tracker.records.length).toBe(1);
            expect(this.tracker.records[0]).toEqual(
                jasmine.objectContaining({ attackingPlayer: this.player, declaredType: 'military', passed: false, uuid: 'c1' })
            );
        });

        it('increments the declared-type opportunity on the attacking player', function () {
            this.tracker.record(this.conflict);
            expect(this.player.declaredConflictOpportunities.military).toBe(1);
        });

        it('increments the passed opportunity when the conflict was passed', function () {
            this.conflict.conflictPassed = true;
            this.tracker.record(this.conflict);
            expect(this.player.declaredConflictOpportunities.passed).toBe(1);
            expect(this.player.declaredConflictOpportunities.military).toBe(0);
        });

        it('increments the forced opportunity when the conflict was forced', function () {
            this.conflict.forcedDeclaredType = 'military';
            this.tracker.record(this.conflict);
            expect(this.player.declaredConflictOpportunities.forced).toBe(1);
            expect(this.player.declaredConflictOpportunities.military).toBe(0);
        });
    });

    describe('recordWinner', function () {
        it('marks the matching record completed with winner and type-switch flag', function () {
            this.tracker.record(this.conflict);
            this.tracker.recordWinner({ uuid: 'c1', winner: this.player, conflictTypeSwitched: true });
            expect(this.tracker.records[0].completed).toBe(true);
            expect(this.tracker.records[0].winner).toBe(this.player);
            expect(this.tracker.records[0].typeSwitched).toBe(true);
        });

        it('does nothing when no record matches the uuid', function () {
            this.tracker.record(this.conflict);
            this.tracker.recordWinner({ uuid: 'other', winner: this.player, conflictTypeSwitched: true });
            expect(this.tracker.records[0].completed).toBeUndefined();
        });
    });

    describe('getForPlayer', function () {
        beforeEach(function () {
            this.tracker.record(this.conflict);
            this.tracker.record(Object.assign({}, this.conflict, { attackingPlayer: this.opponent, uuid: 'c2' }));
        });

        it('returns every record for Players.All', function () {
            expect(this.tracker.getForPlayer(Players.All).length).toBe(2);
        });

        it('returns only the records for the given attacking player', function () {
            expect(this.tracker.getForPlayer(this.player).map((r) => r.uuid)).toEqual(['c1']);
        });
    });

    describe('reset', function () {
        it('clears all stored records', function () {
            this.tracker.record(this.conflict);
            this.tracker.reset();
            expect(this.tracker.records).toEqual([]);
        });
    });
});
