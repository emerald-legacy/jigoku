describe('Yogo Norio', function() {
    integration(function() {
        describe('during the conflict phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['yogo-norio', 'bayushi-liar']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.norio = this.player1.findCardByName('yogo-norio');
                this.liar = this.player1.findCardByName('bayushi-liar');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('should sacrifice a friendly character to gain an additional political conflict', function() {
                expect(this.player1.player.getConflictOpportunities()).toBe(2);
                this.player1.clickCard(this.norio);
                expect(this.player1).toHavePrompt('Select card to sacrifice');
                expect(this.player1).toBeAbleToSelect(this.norio);
                expect(this.player1).toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.liar);
                expect(this.liar.location).toBe('dynasty discard pile');
                expect(this.player1.player.getConflictOpportunities()).toBe(3);
                expect(this.player1.player.getRemainingConflictOpportunitiesForType('political')).toBe(2);
                expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
                expect(this.getChatLogs(3)).toContain(
                    'player1 uses Yogo Norio, sacrificing Bayushi Liar to allow player1 to declare an additional political conflict this phase'
                );
            });
        });

        describe('outside the conflict phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['yogo-norio', 'bayushi-liar']
                    }
                });
                this.norio = this.player1.findCardByName('yogo-norio');
            });

            it('should not be usable', function() {
                expect(this.player1).toHavePrompt('Play cards from provinces');
                this.player1.clickCard(this.norio);
                expect(this.player1).toHavePrompt('Play cards from provinces');
            });
        });
    });
});
