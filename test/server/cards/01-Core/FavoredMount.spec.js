describe('Favored Mount', function() {
    integration(function() {
        describe('playing it', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: ['brash-samurai'],
                        hand: ['favored-mount']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.brash = this.player1.findCardByName('brash-samurai');
                this.mount = this.player1.findCardByName('favored-mount');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('can only be attached to a character you control', function() {
                this.player1.clickCard(this.mount);
                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.brash);
                expect(this.mount.parent).toBe(this.brash);
            });

            it('gives the attached character the Cavalry trait', function() {
                expect(this.brash.hasTrait('cavalry')).toBe(false);
                this.player1.playAttachment(this.mount, this.brash);
                expect(this.mount.parent).toBe(this.brash);
                expect(this.brash.hasTrait('cavalry')).toBe(true);
            });
        });

        describe('its action', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [{ card: 'brash-samurai', attachments: ['favored-mount'] }, 'matsu-berserker']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.brash = this.player1.findCardByName('brash-samurai');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.mount = this.player1.findCardByName('favored-mount');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('bows the attachment to move the attached character to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berserker],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.mount);
                expect(this.mount.bowed).toBe(true);
                expect(this.brash.isAttacking()).toBe(true);
            });

            it('cannot be used outside a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.mount);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.mount.bowed).toBe(false);
                expect(this.game.currentConflict).toBe(null);
            });
        });
    });
});
