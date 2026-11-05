describe('Shosuro Denmaru', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-denmaru'],
                    hand: ['way-of-the-scorpion']
                },
                player2: {
                    inPlay: ['doji-hotaru'],
                    hand: ['way-of-the-crane']
                }
            });

            this.shosuroDenmaru = this.player1.findCardByName('shosuro-denmaru');
            this.wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');

            this.wayOfTheCrane = this.player2.findCardByName('way-of-the-crane');
            this.dojiHotaru = this.player2.findCardByName('doji-hotaru');
        });

        it('should not set base of non-honored characters', function() {
            expect(this.dojiHotaru.glory).toBe(3);

            this.player1.clickCard(this.wayOfTheScorpion);
            this.player1.clickCard(this.dojiHotaru);
            expect(this.dojiHotaru.glory).toBe(3);
        });

        it('should not set base of your own honored characters', function() {
            expect(this.shosuroDenmaru.glory).toBe(1);
            this.shosuroDenmaru.honor();
            this.dojiHotaru.honor();
            this.game.checkGameState(true);
            expect(this.shosuroDenmaru.isHonored).toBe(true);
            expect(this.shosuroDenmaru.glory).toBe(1);
            expect(this.dojiHotaru.glory).toBe(0);
        });

        it('should set base of honored opponent characters to 0', function() {
            expect(this.dojiHotaru.glory).toBe(3);

            this.player1.pass();
            this.player2.clickCard(this.wayOfTheCrane);
            this.player2.clickCard(this.dojiHotaru);
            expect(this.dojiHotaru.glory).toBe(0);
        });
    });
});
