describe('Moto Youth', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['moto-youth', 'shinjo-outrider']
                },
                player2: {
                    inPlay: ['adept-of-the-waves', 'doji-whisperer']
                }
            });
            this.youth = this.player1.findCardByName('moto-youth');
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.adept = this.player2.findCardByName('adept-of-the-waves');
            this.mil = this.youth.militarySkill;
            this.noMoreActions();
        });

        it('gets +1 military during the first military conflict', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.outrider],
                defenders: []
            });
            expect(this.youth.militarySkill).toBe(this.mil + 1);
        });

        it('counts a political conflict switched to military as a military conflict', function () {
            this.initiateConflict({
                type: 'political',
                attackers: [this.outrider],
                defenders: []
            });
            expect(this.youth.militarySkill).toBe(this.mil);
            this.game.currentConflict.switchType();
            this.game.checkGameState(true);
            expect(this.youth.militarySkill).toBe(this.mil + 1);
        });

        it('keeps counting a military conflict switched to political', function () {
            this.initiateConflict({
                type: 'military',
                attackers: [this.outrider],
                defenders: []
            });
            this.game.currentConflict.switchType();
            this.game.checkGameState(true);
            expect(this.game.currentConflict.conflictType).toBe('political');
            expect(this.youth.militarySkill).toBe(this.mil + 1);
        });

        it('does not count a later military conflict after a switched one', function () {
            this.initiateConflict({
                type: 'political',
                attackers: [this.outrider],
                defenders: []
            });
            this.game.currentConflict.switchType();
            this.game.checkGameState(true);
            this.noMoreActions();
            this.player1.clickPrompt('Don\'t resolve');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.adept],
                defenders: []
            });
            expect(this.game.currentConflict.conflictType).toBe('military');
            expect(this.youth.militarySkill).toBe(this.mil);
        });
    });
});
