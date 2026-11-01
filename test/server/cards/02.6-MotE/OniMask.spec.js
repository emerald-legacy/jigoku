describe('Oni Mask', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'kakita-asami', fate: 2 }, 'doji-whisperer'],
                    hand: ['oni-mask', 'oni-mask']
                },
                player2: {
                    inPlay: [
                        'brash-samurai',
                        { card: 'doji-whisperer', attachments: ['collector-of-favors'] },
                        'bayushi-liar'
                    ]
                }
            });
            this.asami = this.player1.findCardByName('kakita-asami');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.otherWhisperer = this.player2.findCardByName('doji-whisperer');
            this.liar = this.player2.findCardByName('bayushi-liar');
            this.oniMask = this.player1.filterCardsByName('oni-mask')[0];
            this.otherMask = this.player1.filterCardsByName('oni-mask')[1];
        });

        it('can only be attached to a character you control', function() {
            this.player1.clickCard(this.oniMask);
            expect(this.player1).toHavePrompt('Oni Mask');
            expect(this.player1).toBeAbleToSelect(this.asami);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.liar);
        });

        it('cannot be used outside a conflict', function() {
            this.player1.playAttachment(this.oniMask, this.asami);
            this.player2.pass();
            this.player1.clickCard(this.oniMask);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.asami.fate).toBe(2);
        });

        describe('during a conflict', function() {
            beforeEach(function() {
                this.player1.playAttachment(this.oniMask, this.asami);
                this.player2.pass();
                this.player1.playAttachment(this.otherMask, this.whisperer);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.asami, this.whisperer],
                    defenders: [this.brash]
                });
                this.player2.pass();
            });

            it('removes 1 fate from the attached character to blank a participating character until the end of the conflict', function() {
                this.player1.clickCard(this.oniMask);
                expect(this.player1).toHavePrompt('Oni Mask');
                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).toBeAbleToSelect(this.asami);
                expect(this.player1).not.toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.otherWhisperer);
                this.player1.clickCard(this.brash);
                expect(this.getChatLogs(5)).toContain('player1 uses Oni Mask, removing 1 fate from Kakita Asami to blank Brash Samurai until the end of the conflict');
                expect(this.asami.fate).toBe(1);
                expect(this.brash.isBlank()).toBe(true);
                this.player2.clickCard(this.brash);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.brash.isHonored).toBe(false);
                this.noMoreActions();
                expect(this.getChatLogs(5)).toContain('player1 won a political conflict 6 vs 1');
                this.player1.clickPrompt('No');
                expect(this.brash.isBlank()).toBe(true);
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.brash.isBlank()).toBe(false);
            });

            it('cannot be used when the attached character has no fate', function() {
                expect(this.whisperer.fate).toBe(0);
                this.player1.clickCard(this.otherMask);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.brash.isBlank()).toBe(false);
            });
        });

        // ruling #163: only printed text is blanked, text gained from another source stays
        it('does not blank an ability gained from an attachment', function() {
            this.player1.playAttachment(this.oniMask, this.asami);
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.asami],
                defenders: [this.otherWhisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.oniMask);
            this.player1.clickCard(this.otherWhisperer);
            expect(this.otherWhisperer.isBlank()).toBe(true);
            const fate = this.player2.fate;
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a political conflict 4 vs 3');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.otherWhisperer);
            this.player2.clickCard(this.otherWhisperer);
            expect(this.player2.fate).toBe(fate + 1);
        });
    });
});
