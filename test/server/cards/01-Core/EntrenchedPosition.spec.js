describe('Entrenched Position', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai']
                },
                player2: {
                    provinces: ['entrenched-position']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.entrenchedPosition = this.player2.findCardByName('entrenched-position');
            this.otherProvince = this.player2.findCardByName('shameful-display', 'province 2');
            this.noMoreActions();
        });

        it('has its printed strength outside a conflict', function() {
            this.entrenchedPosition.facedown = false;
            this.game.checkGameState(true);
            expect(this.player1).toHavePrompt('Initiate Conflict');
            expect(this.entrenchedPosition.getStrength()).toBe(5);
        });

        it('gets +5 strength during a military conflict at it', function() {
            this.initiateConflict({
                type: 'military',
                province: this.entrenchedPosition,
                attackers: [this.brash],
                defenders: []
            });
            expect(this.entrenchedPosition.getStrength()).toBe(10);
        });

        it('gets +5 strength during a military conflict at another province', function() {
            this.entrenchedPosition.facedown = false;
            this.initiateConflict({
                type: 'military',
                province: this.otherProvince,
                attackers: [this.brash],
                defenders: []
            });
            expect(this.entrenchedPosition.getStrength()).toBe(10);
        });

        it('does not get +5 strength during a political conflict', function() {
            this.initiateConflict({
                type: 'political',
                province: this.entrenchedPosition,
                attackers: [this.brash],
                defenders: []
            });
            expect(this.game.currentConflict.conflictType).toBe('political');
            expect(this.entrenchedPosition.getStrength()).toBe(5);
        });
    });
});
