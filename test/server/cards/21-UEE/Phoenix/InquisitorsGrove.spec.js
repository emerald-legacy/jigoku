describe('Inquisitor\'s Grove', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 9,
                    stronghold: 'inquisitor-s-grove',
                    inPlay: ['doji-whisperer']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'brash-samurai', 'kitsu-spiritcaller']
                }
            });
            this.grove = this.player1.findCardByName('inquisitor-s-grove');
            this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
            this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
            this.brashSamurai = this.player2.findCardByName('brash-samurai');
            this.kitsuSpiritcaller = this.player2.findCardByName('kitsu-spiritcaller');
        });

        describe('while defending', function () {
            beforeEach(function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
            });

            it('should let the attacking player choose one of their attacking characters and send it home', function () {
                this.initiateConflict({
                    attackers: [this.matsuBerserker, this.brashSamurai],
                    defenders: [this.dojiWhisperer]
                });
                this.player1.clickCard(this.grove);
                expect(this.player2).toHavePrompt('Choose a character to send home');
                expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
                expect(this.player2).toBeAbleToSelect(this.brashSamurai);
                expect(this.player2).not.toBeAbleToSelect(this.kitsuSpiritcaller);
                expect(this.player2).not.toBeAbleToSelect(this.dojiWhisperer);
                this.player2.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isParticipating()).toBe(false);
                expect(this.brashSamurai.bowed).toBe(false);
                expect(this.matsuBerserker.isParticipating()).toBe(true);
                expect(this.grove.bowed).toBe(true);
            });

            it('should work with more than 9 honor', function () {
                this.player1.honor = 12;
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: [this.dojiWhisperer]
                });
                this.player1.clickCard(this.grove);
                this.player2.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.isParticipating()).toBe(false);
                expect(this.grove.bowed).toBe(true);
            });

            it('should not be usable with 8 or less honor', function () {
                this.player1.honor = 8;
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: [this.dojiWhisperer]
                });
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.grove);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.grove.bowed).toBe(false);
                expect(this.matsuBerserker.isParticipating()).toBe(true);
            });

            it('should not be usable while bowed', function () {
                this.initiateConflict({
                    attackers: [this.matsuBerserker, this.brashSamurai],
                    defenders: [this.dojiWhisperer]
                });
                this.player1.clickCard(this.grove);
                this.player2.clickCard(this.brashSamurai);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.grove);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.matsuBerserker.isParticipating()).toBe(true);
            });
        });

        it('should not be usable while attacking', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dojiWhisperer],
                defenders: [this.matsuBerserker]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.grove);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.grove.bowed).toBe(false);
            expect(this.matsuBerserker.isParticipating()).toBe(true);
        });

        it('should not be usable outside a conflict', function () {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.grove);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.grove.bowed).toBe(false);
        });
    });
});
