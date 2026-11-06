describe('Doji Gift Giver', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['doji-gift-giver', 'kakita-yoshi']
                },
                player2: {
                    fate: 3,
                    inPlay: ['doji-whisperer', 'steward-of-law', 'asahina-artisan', 'brash-samurai']
                }
            });
            this.giftGiver = this.player1.findCardByName('doji-gift-giver');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.steward = this.player2.findCardByName('steward-of-law');
            this.artisan = this.player2.findCardByName('asahina-artisan');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.noMoreActions();
        });

        describe('while it is participating', function() {
            beforeEach(function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.giftGiver, this.yoshi],
                    defenders: [this.whisperer, this.steward, this.artisan]
                });
                this.player2.clickCard(this.artisan);
                this.player2.clickCard(this.whisperer);
                expect(this.artisan.bowed).toBe(true);
            });

            it('gives your opponent 1 fate', function() {
                this.player1.clickCard(this.giftGiver);
                expect(this.player1.fate).toBe(4);
                expect(this.player2.fate).toBe(4);
            });

            it('makes the opponent choose a ready participating character they control and bows it', function() {
                this.player1.clickCard(this.giftGiver);
                expect(this.player2).toBeAbleToSelect(this.whisperer);
                expect(this.player2).toBeAbleToSelect(this.steward);
                expect(this.player2).not.toBeAbleToSelect(this.artisan);
                expect(this.player2).not.toBeAbleToSelect(this.brash);
                expect(this.player2).not.toBeAbleToSelect(this.yoshi);
                expect(this.player2).not.toBeAbleToSelect(this.giftGiver);
                this.player2.clickCard(this.steward);
                expect(this.steward.bowed).toBe(true);
                expect(this.whisperer.bowed).toBe(false);
            });
        });

        it('cannot be used while it is not participating', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.yoshi],
                defenders: [this.whisperer, this.steward]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.giftGiver);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.fate).toBe(5);
            expect(this.player2.fate).toBe(3);
            expect(this.whisperer.bowed).toBe(false);
            expect(this.steward.bowed).toBe(false);
        });
    });
});
