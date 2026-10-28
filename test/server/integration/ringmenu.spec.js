describe('Ring menu commands', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 3
                }
            });
            this.game.rings.air.fate = 2;
        });

        it('do not let a player take the fate on a ring outside manual mode', function() {
            this.game.ringMenuItemClick('player1', { element: 'air' }, { command: 'takefate' });
            expect(this.game.rings.air.fate).toBe(2);
            expect(this.player1.fate).toBe(3);
        });

        it('do not let a player claim a ring outside manual mode', function() {
            this.game.ringMenuItemClick('player1', { element: 'air' }, { command: 'claim' });
            expect(this.game.rings.air.claimed).toBe(false);
        });

        it('work in manual mode', function() {
            this.game.manualMode = true;
            this.game.ringMenuItemClick('player1', { element: 'air' }, { command: 'takefate' });
            expect(this.game.rings.air.fate).toBe(0);
            expect(this.player1.fate).toBe(5);
        });
    });
});

describe('Clicking a ring outside the conflict phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'fate'
            });
            this.game.rings.air.conflictType = 'military';
        });

        it('does not flip it outside manual mode', function() {
            this.game.ringClicked('player1', 'air');
            expect(this.game.rings.air.conflictType).toBe('military');
        });

        it('flips it in manual mode', function() {
            this.game.manualMode = true;
            this.game.ringClicked('player1', 'air');
            expect(this.game.rings.air.conflictType).toBe('political');
        });
    });
});
