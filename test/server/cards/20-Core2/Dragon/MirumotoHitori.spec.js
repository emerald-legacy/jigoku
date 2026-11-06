describe('Mirumoto Hitori', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['mirumoto-hitori']
                },
                player2: {}
            });

            this.hitori = this.player1.findCardByName('mirumoto-hitori');
            this.game.rings.air.claimRing(this.player1);
        });

        it('should interrupt leaving play in the fate phase, remove from game, and re-enter at the start of the next round', function () {
            this.advancePhases('fate');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.hitori);
            this.player1.clickCard(this.hitori);

            // Pay cost: return a claimed ring
            this.player1.clickRing('air');
            this.player1.clickPrompt('Done');

            expect(this.hitori.location).toBe('removed from game');
            expect(this.getChatLogs(10)).toContain(
                'player1 uses Mirumoto Hitori, returning the Air Ring to remove Mirumoto Hitori from play, to be put back into play next round'
            );

            this.player2.clickPrompt('Done');

            this.player2.clickPrompt('End Round');
            this.player1.clickPrompt('End Round');

            expect(this.game.currentPhase).toBe('dynasty');
            expect(this.hitori.location).toBe('play area');
            expect(this.getChatLogs(10)).toContain('Mirumoto Hitori is put into play due to Mirumoto Hitori\'s effect');
        });
    });
});

describe('Mirumoto Hitori without a claimed ring', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['mirumoto-hitori']
                },
                player2: {}
            });

            this.hitori = this.player1.findCardByName('mirumoto-hitori');
        });

        it('cannot interrupt leaving play without a ring to return', function () {
            this.advancePhases('fate');
            expect(this.game.rings.air.isClaimed()).toBe(false);
            this.player1.clickPrompt('Done');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.hitori.location).toBe('dynasty discard pile');
        });
    });
});

describe('Mirumoto Hitori leaving play outside the fate phase', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['mirumoto-hitori', 'steadfast-witch-hunter']
                },
                player2: {}
            });

            this.hitori = this.player1.findCardByName('mirumoto-hitori');
            this.witchHunter = this.player1.findCardByName('steadfast-witch-hunter');
            this.game.rings.air.claimRing(this.player1);
        });

        it('cannot interrupt leaving play during the conflict phase', function () {
            this.witchHunter.bowed = true;
            this.player1.clickCard(this.witchHunter);
            this.player1.clickCard(this.witchHunter);
            expect(this.player1).toHavePrompt('Select card to sacrifice');
            this.player1.clickCard(this.hitori);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.hitori.location).toBe('dynasty discard pile');
            expect(this.witchHunter.bowed).toBe(false);
            expect(this.game.rings.air.isClaimedBy(this.player1.player)).toBe(true);
        });
    });
});
