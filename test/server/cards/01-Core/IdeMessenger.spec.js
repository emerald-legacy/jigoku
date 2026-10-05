describe('Ide Messenger', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 3,
                    inPlay: ['ide-messenger', 'doji-whisperer', 'doji-challenger']
                },
                player2: {
                    inPlay: ['kakita-asami']
                }
            });
            this.messenger = this.player1.findCardByName('ide-messenger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.asami = this.player2.findCardByName('kakita-asami');

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.challenger],
                defenders: []
            });
            this.player2.pass();
        });

        it('spends 1 fate to move a character you control to the conflict', function() {
            this.player1.clickCard(this.messenger);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.messenger);
            expect(this.player1).not.toBeAbleToSelect(this.asami);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.isParticipating()).toBe(true);
            expect(this.player1.fate).toBe(2);
        });
    });
});
