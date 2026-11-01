describe('Height of Fashion', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['doji-whisperer'],
                    hand: ['height-of-fashion']
                },
                player2: {
                    inPlay: ['valiant-oathkeeper']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.heightOfFashion = this.player1.findCardByName('height-of-fashion');
        });

        it('can be played in the action window before a conflict is declared (ruling #51)', function() {
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.game.currentConflict).toBeNull();
            this.player1.playAttachment(this.heightOfFashion, this.whisperer);
            expect(this.heightOfFashion.location).toBe('play area');
            expect(this.whisperer.attachments).toContain(this.heightOfFashion);
            expect(this.whisperer.politicalSkill).toBe(7);
            expect(this.player1.fate).toBe(8);
        });

        it('cannot be played during a conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: []
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.heightOfFashion);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.heightOfFashion.location).toBe('hand');
            expect(this.whisperer.attachments.length).toBe(0);
            expect(this.player1.fate).toBe(10);
        });
    });
});
