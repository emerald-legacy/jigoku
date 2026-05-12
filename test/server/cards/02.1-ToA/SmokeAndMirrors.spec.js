describe('Smoke and Mirrors', function() {
    integration(function() {
        describe('Smoke and Mirrors\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-shadows', 'miya-mystic'],
                        hand: ['smoke-and-mirrors']
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });
                this.adeptOfShadows = this.player1.findCardByName('adept-of-shadows');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfShadows],
                    defenders: []
                });
            });

            it('should only be able to target attacking shinobi characters', function() {
                this.player2.pass();
                this.player1.clickCard('smoke-and-mirrors');
                expect(this.player1).toBeAbleToSelect(this.adeptOfShadows);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            });

            it('should move the attacking shinobi character home', function() {
                this.player2.pass();
                this.player1.clickCard('smoke-and-mirrors');
                this.player1.clickCard(this.adeptOfShadows);
                this.player1.clickPrompt('Done');
                expect(this.adeptOfShadows.inConflict).toBe(false);
            });
        });
    });
});
