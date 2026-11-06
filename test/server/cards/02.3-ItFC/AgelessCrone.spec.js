describe('Ageless Crone', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    honor: 10,
                    inPlay: ['ageless-crone', 'brash-samurai'],
                    hand: ['assassination']
                },
                player2: {
                    fate: 5,
                    inPlay: ['matsu-berserker'],
                    hand: ['banzai']
                }
            });
            this.crone = this.player1.findCardByName('ageless-crone');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.noMoreActions();
        });

        describe('while it is participating', function() {
            beforeEach(function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.crone, this.brash],
                    defenders: [this.berserker]
                });
            });

            it('increases the cost of each player\'s events by 1', function() {
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.berserker);
                this.player2.clickPrompt('Done');
                expect(this.player2.fate).toBe(4);
                expect(this.player2.findCardByName('banzai').location).toBe('conflict discard pile');
            });

            // ruling #259: only the fate cost goes up, not the additional costs
            it('increases the fate cost of its controller\'s events but not their additional costs', function() {
                this.player2.pass();
                this.player1.clickCard('assassination');
                this.player1.clickCard(this.berserker);
                expect(this.player1.fate).toBe(4);
                expect(this.player1.honor).toBe(7);
                expect(this.berserker.location).toBe('dynasty discard pile');
            });
        });

        it('does not increase event costs while it is not participating', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.brash],
                defenders: [this.berserker]
            });
            expect(this.crone.isParticipating()).toBe(false);
            this.player2.clickCard('banzai');
            this.player2.clickCard(this.berserker);
            this.player2.clickPrompt('Done');
            expect(this.player2.fate).toBe(5);
            expect(this.player2.findCardByName('banzai').location).toBe('conflict discard pile');
        });
    });
});
