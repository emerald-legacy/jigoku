describe('Moto Juro', function() {
    integration(function() {
        describe('Moto Juro\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-juro', 'miya-mystic']
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });
                this.motoJuro = this.player1.findCardByName('moto-juro');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: []
                });
            });

            it('should offer a choice to move into conflict when at home', function() {
                this.player2.pass();
                this.player1.clickCard(this.motoJuro);
                expect(this.player1).toHavePrompt('Moto Juro');
                expect(this.player1.currentButtons).toContain('Move into conflict');
            });

            it('should move Moto Juro into the conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.motoJuro);
                this.player1.clickPrompt('Move into conflict');
                expect(this.motoJuro.isParticipating()).toBe(true);
            });

            it('should move Moto Juro home when already participating', function() {
                this.player2.pass();
                this.player1.clickCard(this.motoJuro);
                this.player1.clickPrompt('Move into conflict');
                this.player2.pass();
                this.player1.clickCard(this.motoJuro);
                this.player1.clickPrompt('Move home');
                expect(this.motoJuro.isParticipating()).toBe(false);
            });

            it('should be limited to twice per round', function() {
                this.player2.pass();
                this.player1.clickCard(this.motoJuro);
                this.player1.clickPrompt('Move into conflict');
                this.player2.pass();
                this.player1.clickCard(this.motoJuro);
                this.player1.clickPrompt('Move home');
                this.player2.pass();
                this.player1.clickCard(this.motoJuro);
                expect(this.player1).not.toHavePrompt('Choose an option');
            });
        });
    });
});
