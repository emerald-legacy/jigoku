describe('Guard Duty', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'brash-samurai', attachments: ['guard-duty'] }, 'doji-whisperer']
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.guardDuty = this.player1.findCardByName('guard-duty');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.noMoreActions();
        });

        it('honors the attached character while it is defending', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.brash]
            });
            this.player1.clickCard(this.guardDuty);
            expect(this.brash.isHonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Guard Duty to honor Brash Samurai');
        });

        it('cannot be used while the attached character is attacking', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.brash],
                defenders: [this.berserker]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.guardDuty);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.brash.isHonored).toBe(false);
        });

        it('cannot be used while the attached character is not participating', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.whisperer]
            });
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.guardDuty);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.brash.isHonored).toBe(false);
        });
    });
});
