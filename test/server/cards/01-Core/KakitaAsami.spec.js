describe('Kakita Asami', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['kakita-asami', 'doji-whisperer']
                },
                player2: {
                    honor: 10,
                    inPlay: ['doji-challenger', 'doji-whisperer']
                }
            });
            this.asami = this.player1.findCardByName('kakita-asami');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.opponentWhisperer = this.player2.findCardByName('doji-whisperer');
            this.noMoreActions();
        });

        it('takes 1 honor while you count more political skill', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.asami, this.whisperer],
                defenders: [this.challenger]
            });
            this.player2.pass();
            this.player1.clickCard(this.asami);
            expect(this.player1.honor).toBe(11);
            expect(this.player2.honor).toBe(9);
        });

        it('cannot be used while you count less political skill', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.asami],
                defenders: [this.challenger, this.opponentWhisperer]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.asami);
            expect(this.player1.honor).toBe(10);
            expect(this.player2.honor).toBe(10);
        });

        it('cannot be used while not participating', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.asami);
            expect(this.player1.honor).toBe(10);
            expect(this.player2.honor).toBe(10);
        });

        it('cannot be used in a military conflict', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.asami, this.whisperer],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.asami);
            expect(this.player1.honor).toBe(10);
            expect(this.player2.honor).toBe(10);
        });
    });
});
