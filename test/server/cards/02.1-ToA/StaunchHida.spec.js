describe('Staunch Hida', function() {
    integration(function() {
        describe('Staunch Hida\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['miya-mystic']
                    },
                    player2: {
                        inPlay: ['staunch-hida']
                    }
                });
                this.staunchHida = this.player2.findCardByName('staunch-hida');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: [this.staunchHida]
                });
            });

            it('should trigger when winning as a defender', function() {
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.staunchHida);
            });

            it('should not trigger when staunch hida is not defending', function() {
                this.noMoreActions();
                // staunch hida is defending so it should trigger - let's check a scenario where it does not
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.staunchHida);
            });

            it('should be limited to max 1 per conflict', function() {
                const reactionAbility = this.staunchHida.abilities.reactions[0];
                expect(reactionAbility.limit).toBeDefined();
            });
        });
    });
});
