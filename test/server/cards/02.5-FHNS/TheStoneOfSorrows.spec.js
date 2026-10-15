describe('The Stone of Sorrows', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-whisperer', attachments: ['the-stone-of-sorrows'] }]
                },
                player2: {
                    inPlay: ['tranquil-philosopher']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.philosopher = this.player2.findCardByName('tranquil-philosopher');
            this.game.rings.air.fate = 2;
            this.player1.pass();
        });

        it('stops opponents moving fate from one ring to another', function () {
            const honor = this.player2.honor;
            this.player2.clickCard(this.philosopher);
            this.player2.clickRing('air');
            expect(this.player2).not.toHavePrompt('Choose an unclaimed ring to move fate to');
            expect(this.player2.honor).toBe(honor + 1);
            expect(this.game.rings.air.fate).toBe(2);
            expect(this.game.rings.fire.fate).toBe(0);
        });

        it('doesn\'t stop them while the attached character is bowed', function () {
            this.whisperer.bowed = true;
            this.player2.clickCard(this.philosopher);
            this.player2.clickRing('air');
            this.player2.clickRing('fire');
            expect(this.game.rings.air.fate).toBe(1);
            expect(this.game.rings.fire.fate).toBe(1);
        });
    });
});
