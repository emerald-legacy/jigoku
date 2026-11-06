describe('Tarnished Reputation', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'brash-samurai'],
                    hand: ['tarnished-reputation']
                },
                player2: {
                    inPlay: ['doji-challenger', 'kakita-yoshi']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.tarnished = this.player1.findCardByName('tarnished-reputation');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
        });

        it('dishonors a participating character', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: [this.challenger]
            });
            this.player2.pass();
            this.player1.clickCard(this.tarnished);
            this.player1.clickCard(this.challenger);
            expect(this.challenger.isDishonored).toBe(true);
            expect(this.tarnished.location).toBe('conflict discard pile');
        });

        it('only offers participating characters', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: [this.challenger]
            });
            this.player2.pass();
            this.player1.clickCard(this.tarnished);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
        });

        it('cannot be played outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.tarnished);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.tarnished.location).toBe('hand');
            expect(this.whisperer.isDishonored).toBe(false);
            expect(this.yoshi.isDishonored).toBe(false);
        });
    });
});
