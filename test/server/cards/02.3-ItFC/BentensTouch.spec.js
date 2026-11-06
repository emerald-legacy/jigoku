describe('Benten\'s Touch', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves', { card: 'solemn-scholar', bowed: true }, 'kitsu-spiritcaller', 'brash-samurai'],
                    hand: ['benten-s-touch', 'benten-s-touch']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.adept = this.player1.findCardByName('adept-of-the-waves', 'play area');
            this.scholar = this.player1.findCardByName('solemn-scholar');
            this.spiritcaller = this.player1.findCardByName('kitsu-spiritcaller');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.touches = this.player1.filterCardsByName('benten-s-touch', 'hand');
        });

        it('cannot be played outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.touches[0]);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.touches[0].location).toBe('hand');
            expect(this.adept.bowed).toBe(false);
        });

        describe('during a conflict', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.adept, this.brash],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
            });

            it('bows a friendly Phoenix Shugenja to honor a participating character you control', function() {
                this.player1.clickCard(this.touches[0]);
                expect(this.player1).toHavePrompt('Choose a character to honor');
                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).toBeAbleToSelect(this.adept);
                expect(this.player1).not.toBeAbleToSelect(this.spiritcaller);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.brash);
                expect(this.player1).toHavePrompt('Select card to bow');
                expect(this.player1).toBeAbleToSelect(this.adept);
                expect(this.player1).not.toBeAbleToSelect(this.scholar);
                expect(this.player1).not.toBeAbleToSelect(this.spiritcaller);
                this.player1.clickCard(this.adept);
                expect(this.adept.bowed).toBe(true);
                expect(this.brash.isHonored).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 plays Benten\'s Touch, bowing Adept of the Waves to honor Brash Samurai');
            });

            it('cannot be played without a ready friendly Phoenix Shugenja to bow', function() {
                this.player1.clickCard(this.touches[0]);
                this.player1.clickCard(this.brash);
                this.player1.clickCard(this.adept);
                this.player2.pass();
                expect(this.adept.bowed).toBe(true);
                expect(this.spiritcaller.bowed).toBe(false);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.touches[1]);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.touches[1].location).toBe('hand');
            });
        });
    });
});
