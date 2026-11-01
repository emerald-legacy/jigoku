describe('Shinjo Outrider', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-outrider', 'border-rider']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.borderRider = this.player1.findCardByName('border-rider');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('moves itself to the conflict during a conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.borderRider],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            expect(this.outrider.isParticipating()).toBe(false);
            this.player1.clickCard(this.outrider);
            expect(this.outrider.isAttacking()).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Shinjo Outrider to move Shinjo Outrider into the conflict');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('cannot be used outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.outrider);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.outrider.isParticipating()).toBe(false);
        });

        it('cannot be used while it is already participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.outrider],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            expect(this.outrider.isAttacking()).toBe(true);
            this.player1.clickCard(this.outrider);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(3)).not.toContain('player1 uses Shinjo Outrider to move Shinjo Outrider into the conflict');
        });
    });
});
