describe('Waseit\'s Blessing', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['brash-samurai', 'doji-challenger', 'akodo-toturi'],
                    hand: ['waseit-s-blessing', 'waseit-s-blessing']
                },
                player2: {
                    inPlay: ['kakita-asami', 'kakita-yoshi', 'doji-whisperer']
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.blessing1 = this.player1.filterCardsByName('waseit-s-blessing')[0];
            this.blessing2 = this.player1.filterCardsByName('waseit-s-blessing')[1];
            this.asami = this.player2.findCardByName('kakita-asami');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.whisperer = this.player2.findCardByName('doji-whisperer');

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brashSamurai, this.challenger],
                defenders: [this.asami, this.yoshi]
            });
            this.player2.pass();
        });

        it('should move a defending character and an attacking character home', function() {
            this.player1.clickCard(this.blessing1);
            expect(this.player1).toBeAbleToSelect(this.asami);
            expect(this.player1).toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.toturi);
            this.player1.clickCard(this.yoshi);
            expect(this.player1).toBeAbleToSelect(this.brashSamurai);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.asami);
            expect(this.player1).not.toBeAbleToSelect(this.toturi);
            this.player1.clickCard(this.brashSamurai);
            expect(this.yoshi.isParticipating()).toBe(false);
            expect(this.brashSamurai.isParticipating()).toBe(false);
            expect(this.asami.isDefending()).toBe(true);
            expect(this.challenger.isAttacking()).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 plays Waseit\'s Blessing to send home Kakita Yoshi and Brash Samurai');
        });

        it('should only be playable once per round', function() {
            this.player1.clickCard(this.blessing1);
            this.player1.clickCard(this.yoshi);
            this.player1.clickCard(this.brashSamurai);
            expect(this.blessing1.location).toBe('conflict discard pile');
            this.player2.pass();
            this.player1.clickCard(this.blessing2);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.blessing2.location).toBe('hand');
            expect(this.asami.isDefending()).toBe(true);
        });
    });
});
