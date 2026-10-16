describe('Master of the Spear', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['master-of-the-spear', 'togashi-yokuni']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.masterOfTheSpear = this.player1.findCardByName('master-of-the-spear');
            this.togashiYokuni = this.player1.findCardByName('togashi-yokuni');
            this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('should make the opponent send home one of their participating characters', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.masterOfTheSpear],
                defenders: [this.dojiWhisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.masterOfTheSpear);
            expect(this.player2).toHavePrompt('Choose a character to send home');
            this.player2.clickCard(this.dojiWhisperer);
            expect(this.dojiWhisperer.inConflict).toBe(false);
        });

        it('should not work while this character is not attacking', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.togashiYokuni],
                defenders: [this.dojiWhisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.masterOfTheSpear);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should work for Togashi Yokuni copying it while Yokuni is attacking', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.togashiYokuni],
                defenders: [this.dojiWhisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.togashiYokuni);
            this.player1.clickCard(this.masterOfTheSpear);
            this.player2.pass();
            this.player1.clickCard(this.togashiYokuni);
            expect(this.player2).toHavePrompt('Choose a character to send home');
            this.player2.clickCard(this.dojiWhisperer);
            expect(this.dojiWhisperer.inConflict).toBe(false);
        });
    });
});
