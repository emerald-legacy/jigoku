describe('Magari-Yari', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['brash-samurai', 'doji-challenger', 'doji-whisperer'],
                    hand: ['magari-yari']
                },
                player2: {
                    inPlay: ['kakita-asami', 'akodo-toturi', 'kakita-yoshi']
                }
            });

            this.brashSamurai = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.magariYari = this.player1.findCardByName('magari-yari');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
        });

        it('should give +3 military', function() {
            this.player1.playAttachment(this.magariYari, this.brashSamurai);
            expect(this.brashSamurai.getMilitarySkill()).toBe(5);
            expect(this.brashSamurai.getPoliticalSkill()).toBe(1);
        });

        it('should bow a character with lower military skill that moves to a military conflict', function() {
            this.player1.playAttachment(this.magariYari, this.brashSamurai);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai, this.challenger],
                defenders: [this.yoshi]
            });
            this.player2.pass();
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.asami);
            expect(this.asami.isDefending()).toBe(true);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.brashSamurai);
            this.player1.clickCard(this.brashSamurai);
            expect(this.asami.bowed).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Brash Samurai\'s gained ability from Magari-Yari to bow Kakita Asami');
        });

        it('should not trigger for a character with higher military skill', function() {
            this.player1.playAttachment(this.magariYari, this.brashSamurai);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brashSamurai, this.challenger],
                defenders: [this.yoshi]
            });
            this.player2.pass();
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.isDefending()).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.toturi.bowed).toBe(false);
        });

        it('should not trigger in a political conflict', function() {
            this.player1.playAttachment(this.magariYari, this.brashSamurai);
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.brashSamurai, this.challenger],
                defenders: [this.yoshi]
            });
            this.player2.pass();
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.asami);
            expect(this.asami.isDefending()).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.asami.bowed).toBe(false);
        });

        it('should not give the ability to a non-Bushi character', function() {
            this.player1.playAttachment(this.magariYari, this.whisperer);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer, this.challenger],
                defenders: [this.yoshi]
            });
            this.player2.pass();
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.asami);
            expect(this.asami.isDefending()).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.asami.bowed).toBe(false);
        });
    });
});
