describe('Asako Tsuki', function() {
    integration(function() {
        describe('Asako Tsuki\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-tsuki', 'solemn-scholar'],
                        hand: ['commune-with-the-spirits']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.tsuki = this.player1.findCardByName('asako-tsuki');
                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.commune = this.player1.findCardByName('commune-with-the-spirits');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('should trigger after the water ring is claimed in a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    attackers: [this.tsuki],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.tsuki);
                this.player1.clickCard(this.tsuki);
                expect(this.player1).toBeAbleToSelect(this.scholar);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.scholar);
                expect(this.scholar.isHonored).toBe(true);
            });

            it('should trigger after the water ring is claimed outside a conflict', function() {
                this.player1.clickCard(this.commune);
                this.player1.clickRing('water');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.tsuki);
            });

            it('should not trigger after another ring is claimed', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: [this.tsuki],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.tsuki);
            });
        });
    });
});
