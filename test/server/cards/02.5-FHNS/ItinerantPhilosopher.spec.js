describe('Itinerant Philosopher', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['itinerant-philosopher', 'brash-samurai']
                },
                player2: {
                    inPlay: [
                        { card: 'matsu-berserker', attachments: ['fine-katana'] },
                        { card: 'ikoma-prodigy', attachments: ['ornate-fan'] },
                        'doji-whisperer'
                    ]
                }
            });
            this.philosopher = this.player1.findCardByName('itinerant-philosopher');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.prodigy = this.player2.findCardByName('ikoma-prodigy');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        describe('while you have the Imperial Favor', function() {
            beforeEach(function() {
                // set directly: claiming the favor needs a full glory count
                this.player1.player.imperialFavor = 'political';
                this.noMoreActions();
            });

            // ruling #204: the discarded favor returns to the unclaimed state
            it('discards the favor to bow a participating opponent\'s character with an attachment', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.philosopher],
                    defenders: [this.berserker, this.whisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.philosopher);
                expect(this.player1).toHavePrompt('Itinerant Philosopher');
                expect(this.player1).toBeAbleToSelect(this.berserker);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.prodigy);
                expect(this.player1).not.toBeAbleToSelect(this.philosopher);
                this.player1.clickCard(this.berserker);
                expect(this.berserker.bowed).toBe(true);
                expect(this.player1.player.imperialFavor).toBe('');
                expect(this.player2.player.imperialFavor).toBe('');
                expect(this.getChatLogs(5)).toContain('player1 uses Itinerant Philosopher, discarding the Imperial Favor to bow Matsu Berserker');
            });

            it('cannot be used while it is not participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brash],
                    defenders: [this.berserker]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.philosopher);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.berserker.bowed).toBe(false);
                expect(this.player1.player.imperialFavor).toBe('political');
            });
        });

        // ruling #203: it can only be used if you control the Imperial Favor
        it('cannot be used without the Imperial Favor', function() {
            this.player2.player.imperialFavor = 'political';
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.philosopher],
                defenders: [this.berserker]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.philosopher);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.berserker.bowed).toBe(false);
            expect(this.player2.player.imperialFavor).toBe('political');
        });
    });
});
