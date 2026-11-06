describe('Rogue Understudy', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['rogue-understudy']
                }
            });

            this.rogueUnderstudy = this.player1.findCardByName('rogue-understudy');
        });

        it('should ready itself for 1 honor', function () {
            this.rogueUnderstudy.bowed = true;
            this.player1.clickCard(this.rogueUnderstudy);
            expect(this.rogueUnderstudy.bowed).toBe(false);
            expect(this.player1.honor).toBe(9);
        });

        it('should not be usable while ready', function () {
            expect(this.rogueUnderstudy.bowed).toBe(false);
            this.player1.clickCard(this.rogueUnderstudy);
            expect(this.player1).toHavePrompt('Initiate an action');
            expect(this.player1.honor).toBe(10);
        });
    });
});
