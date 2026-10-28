describe('Make An Opening', function() {
    integration(function() {
        describe('Make An Opening\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['miya-mystic'],
                        hand: ['make-an-opening']
                    },
                    player2: {
                        inPlay: ['tengu-sensei', 'asahina-artisan']
                    }
                });
                this.tenguSensei = this.player2.findCardByName('tengu-sensei');
                this.asahinaArtisan = this.player2.findCardByName('asahina-artisan');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['miya-mystic'],
                    defenders: [this.tenguSensei, this.asahinaArtisan]
                });
            });

            describe('When played, it', function() {
                // Tengu Sensei is 4 military / 2 political
                [
                    { p1: 5, p2: 4, mil: 3, pol: 1 },
                    { p1: 4, p2: 5, mil: 3, pol: 1 },
                    { p1: 5, p2: 3, mil: 2, pol: 0 },
                    { p1: 1, p2: 5, mil: 0, pol: 0 }
                ].forEach(function(bids) {
                    it(`should apply absolute diff of honor dial to military and political skill of target character (bids ${bids.p1} vs ${bids.p2})`, function() {
                        this.player1.player.showBid = bids.p1;
                        this.player2.player.showBid = bids.p2;
                        this.player2.pass();
                        this.player1.clickCard('make-an-opening');
                        this.player1.clickCard(this.tenguSensei);
                        expect(this.tenguSensei.militarySkill).toBe(bids.mil);
                        expect(this.tenguSensei.politicalSkill).toBe(bids.pol);
                    });
                });
            });

            it('should not be playable when honor dials are the same value', function() {
                this.player1.player.showBid = 5;
                this.player2.player.showBid = 5;
                this.player2.pass();
                this.player1.clickCard('make-an-opening');
                expect(this.player1).not.toHavePrompt('Make an Opening');
                expect(this.player1).not.toBeAbleToSelect(this.tenguSensei);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player1.findCardByName('make-an-opening').location).toBe('hand');
            });
        });
    });
});
