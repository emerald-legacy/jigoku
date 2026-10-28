describe('Good Omen', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['illustrious-plagiarist', 'doji-kuwanan']
                },
                player2: {
                    inPlay: ['bayushi-shoju'],
                    hand: ['good-omen']
                }
            });
            this.plagiarist = this.player1.findCardByName('illustrious-plagiarist');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.shoju = this.player2.findCardByName('bayushi-shoju');
            this.goodOmen = this.player2.findCardByName('good-omen');
            this.player1.player.showBid = 5;
            this.player2.player.showBid = 1;
        });

        it('should place a fate when its player has composure', function() {
            const fate = this.shoju.fate;
            this.player1.pass();
            this.player2.clickCard(this.goodOmen);
            this.player2.clickCard(this.shoju);
            expect(this.shoju.fate).toBe(fate + 1);
        });

        it('should need composure when an Illustrious Plagiarist uses a copy', function() {
            this.player1.pass();
            this.player2.clickCard(this.goodOmen);
            this.player2.clickCard(this.shoju);
            this.player1.clickCard(this.plagiarist);
            this.player1.clickCard(this.goodOmen);
            this.player2.pass();
            this.player1.clickCard(this.plagiarist);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.kuwanan.fate).toBe(0);
        });

        it('should let an Illustrious Plagiarist use a copy with composure', function() {
            this.player1.pass();
            this.player2.clickCard(this.goodOmen);
            this.player2.clickCard(this.shoju);
            this.player1.clickCard(this.plagiarist);
            this.player1.clickCard(this.goodOmen);
            this.player1.player.showBid = 1;
            this.player2.player.showBid = 5;
            this.player2.pass();
            this.player1.clickCard(this.plagiarist);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            this.player1.clickCard(this.kuwanan);
            expect(this.kuwanan.fate).toBe(1);
        });
    });
});
