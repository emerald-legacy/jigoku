describe('Disguised Protector', function() {
    integration(function() {
        describe('Disguised Protector\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['disguised-protector', 'adept-of-shadows']
                    },
                    player2: {
                        inPlay: ['intimidating-hida']
                    }
                });
                this.player1.player.showBid = 5;
                this.player2.player.showBid = 1;
                this.noMoreActions();
            });

            it('should add each players bid to their conflict skill modifier when disguised protector is particiating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['disguised-protector', 'adept-of-shadows'],
                    defenders: ['intimidating-hida']
                });
                this.player2.pass();
                this.player1.clickCard('disguised-protector');
                expect(this.player1.player.skillModifier).toBe(this.player1.player.showBid);
                expect(this.player2.player.skillModifier).toBe(this.player2.player.showBid);
            });

            it('should use the bid on the dial when the conflict resolves', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['disguised-protector', 'adept-of-shadows'],
                    defenders: ['intimidating-hida']
                });
                this.player2.pass();
                this.player1.clickCard('disguised-protector');
                this.player1.player.showBid = 2;
                this.player2.player.showBid = 3;
                this.game.checkGameState(true);
                expect(this.player1.player.skillModifier).toBe(2);
                expect(this.player2.player.skillModifier).toBe(3);
            });

            it('should not let a defender without participating characters win with their bid', function() {
                this.player1.player.showBid = 1;
                this.player2.player.showBid = 5;
                this.initiateConflict({
                    type: 'military',
                    attackers: ['disguised-protector'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('disguised-protector');
                this.player2.pass();
                this.player1.pass();
                expect(this.getChatLogs(20)).toContain('Attacker is winning the conflict');
                expect(this.getChatLogs(20).some((line) => line.startsWith('player1 won a military conflict'))).toBe(true);
            });

            it('should not add each players bid to their conflict skill modifier when disguised protector is not particiating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['adept-of-shadows'],
                    defenders: ['intimidating-hida']
                });
                this.player2.pass();
                this.player1.clickCard('disguised-protector');
                expect(this.player1.player.skillModifier).toBe(0);
                expect(this.player2.player.skillModifier).toBe(0);
            });
        });
    });
});
