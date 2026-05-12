describe('Shinjo Saddle', function() {
    integration(function() {
        describe('Shinjo Saddle\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider', 'miya-mystic'],
                        hand: ['shinjo-saddle']
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });
                this.outrider = this.player1.findCardByName('shinjo-outrider');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.saddle = this.player1.playAttachment('shinjo-saddle', this.outrider);
            });

            it('should only be targetable to cavalry characters when moved', function() {
                this.player2.pass();
                this.player1.clickCard(this.saddle);
                expect(this.player1).toBeAbleToSelect(this.outrider);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            });

            it('should move to another cavalry character', function() {
                this.player2.pass();
                this.player1.clickCard(this.saddle);
                this.player1.clickCard(this.outrider);
                expect(this.outrider.attachments).toContain(this.saddle);
            });
        });
    });
});
