import { HonorTracker } from '../../build/server/game/HonorTracker.js';

describe('HonorTracker', function() {
    beforeEach(function() {
        this.tracker = new HonorTracker();
        this.tracker.modifyHonor(2, 'dynasty', 1);
        this.tracker.modifyHonor(3, 'conflict', 1);
        this.tracker.modifyHonor(4, 'dynasty', 2);
        this.tracker.modifyHonor(5, 'conflict', 2);
    });

    describe('resetHonorEvents()', function() {
        beforeEach(function() {
            this.tracker.resetHonorEvents(2, 'dynasty');
        });

        it('forgets the honor of that phase in that round', function() {
            expect(this.tracker.honorGained(2, 'dynasty')).toBe(0);
        });

        it('keeps the honor of other phases in that round', function() {
            expect(this.tracker.honorGained(2, 'conflict')).toBe(5);
        });

        it('keeps the honor of the same phase in other rounds', function() {
            expect(this.tracker.honorGained(1, 'dynasty')).toBe(2);
        });
    });
});
