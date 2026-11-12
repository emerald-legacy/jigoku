describe('Summary of a visible card', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-challenger', attachments: ['fine-katana'] }, 'brash-samurai']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.brash = this.player1.findCardByName('brash-samurai');
        });

        it('leaves out fields with a default value', function() {
            const summary = this.brash.getSummary(this.player2.player, false);

            for(const key of ['bowed', 'isHonored', 'isDishonored', 'tokens', 'attachments', 'attached', 'popupMenuText']) {
                expect(summary[key]).withContext(key).toBeUndefined();
            }
            expect(summary.name).toBe('Brash Samurai');
            expect(summary.militarySkillSummary.stat).toBe('2');
        });

        it('keeps a field once it is set', function() {
            this.brash.bow();
            this.brash.honor();

            const summary = this.brash.getSummary(this.player2.player, false);
            expect(summary.bowed).toBe(true);
            expect(summary.isHonored).toBe(true);
        });

        it('names the controller instead of sending the player summary', function() {
            expect(this.brash.getSummary(this.player2.player, false).controller).toBe('player1');
        });

        it('leaves the default fields out of attachments too', function() {
            const attachment = this.challenger.getSummary(this.player2.player, false).attachments[0];

            expect(attachment.name).toBe('Fine Katana');
            expect(attachment.attached).toBe(true);
            expect(attachment.bowed).toBeUndefined();
            expect(attachment.militarySkillSummary).toBeUndefined();
        });
    });
});
