describe('Miya Mystic', function() {
    integration(function() {
        describe('during the conflict phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['miya-mystic', 'valiant-oathkeeper']
                    },
                    player2: {
                        inPlay: [{ card: 'doji-whisperer', attachments: ['fine-katana'] }]
                    }
                });
                this.mystic = this.player1.findCardByName('miya-mystic');
                this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.katana = this.player2.findCardByName('fine-katana');
            });

            it('sacrifices itself to discard an attachment', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.mystic);
                expect(this.player1).toHavePrompt('Miya Mystic');
                expect(this.player1).toBeAbleToSelect(this.katana);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.katana);
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.mystic.location).toBe('dynasty discard pile');
                expect(this.whisperer.attachments.length).toBe(0);
            });
        });

        describe('outside the conflict phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['miya-mystic']
                    },
                    player2: {
                        inPlay: [{ card: 'doji-whisperer', attachments: ['fine-katana'] }]
                    }
                });
                this.mystic = this.player1.findCardByName('miya-mystic');
                this.katana = this.player2.findCardByName('fine-katana');
            });

            it('cannot be used', function() {
                expect(this.player1).toHavePrompt('Play cards from provinces');
                this.player1.clickCard(this.mystic);
                expect(this.player1).toHavePrompt('Play cards from provinces');
                expect(this.mystic.location).toBe('play area');
                expect(this.katana.location).toBe('play area');
            });
        });
    });
});
