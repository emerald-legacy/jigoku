describe('Chat commands', function() {
    integration(function() {
        describe('/move-to-bottom-deck', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['banzai']
                    }
                });
                this.banzai = this.player1.findCardByName('banzai');
                this.game.manualMode = true;
            });

            it('should move the chosen card to the bottom of its deck and say which deck', function() {
                this.game.chat('player1', '/move-to-bottom-deck');
                this.game.continue();
                this.player1.clickCard(this.banzai);

                expect(this.banzai.location).toBe('conflict deck');
                expect(this.player1.conflictDeck[this.player1.conflictDeck.length - 1]).toBe(this.banzai);
                expect(this.getChatLogs(3)).toContain('player1 uses a command to move a card from their hand to the bottom of their conflict deck.');
                expect(this.getChatLogs(3).some((line) => line.includes('Banzai!'))).toBe(false);
            });

            it('should name a card taken from a public pile', function() {
                this.player1.moveCard(this.banzai, 'conflict discard pile');
                this.game.chat('player1', '/move-to-bottom-deck');
                this.game.continue();
                this.player1.clickCard(this.banzai);

                expect(this.banzai.location).toBe('conflict deck');
                expect(this.getChatLogs(3)).toContain('player1 uses a command to move Banzai! from their conflict discard pile to the bottom of their conflict deck.');
            });
        });

        describe('outside manual mode', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3
                    }
                });
                this.game.rings.air.fate = 2;
            });

            it('should not run a command that changes the game state', function() {
                const handSize = this.player1.hand.length;
                this.game.chat('player1', '/claim-ring air');
                this.game.chat('player1', '/rem-fate-ring air 2');
                this.game.chat('player1', '/draw 1');
                this.game.continue();
                expect(this.game.manualMode).toBe(false);
                expect(this.game.rings.air.claimed).toBe(false);
                expect(this.game.rings.air.fate).toBe(2);
                expect(this.player1.hand.length).toBe(handSize);
            });

            it('should still run /roll and /manual', function() {
                this.game.chat('player1', '/roll 6');
                this.game.chat('player1', '/manual');
                expect(this.getChatLogs(3).some((line) => line.startsWith('player1 rolls a d6: '))).toBe(true);
                expect(this.game.manualMode).toBe(true);
            });
        });

        describe('in manual mode', function() {
            beforeEach(function() {
                this.setupTest({
                    gameMode: 'emerald',
                    phase: 'conflict'
                });
                this.game.manualMode = true;
            });

            it('/claim-favor should name the Empress\' favor once', function() {
                this.game.chat('player1', '/claim-favor political');
                this.game.continue();
                expect(this.player1.player.imperialFavor).toBe('political');
                expect(this.getChatLogs(3)).toContain('player1 uses /claim-favor to claim the Empress\' political favor');
                expect(this.getChatLogs(3).filter((line) => line.includes('favor')).length).toBe(1);
            });

            it('/claim-favor should ask for the side when the argument names none', function() {
                this.game.chat('player1', '/claim-favor both');
                this.game.continue();
                expect(this.player1).toHavePrompt('Which side of the Imperial Favor would you like to claim?');
                this.player1.clickPrompt('Military');
                expect(this.player1.player.imperialFavor).toBe('military');
                expect(this.getChatLogs(3)).toContain('player1 uses /claim-favor to claim the Empress\' military favor');
                expect(this.getChatLogs(3).filter((line) => line.includes('favor')).length).toBe(1);
            });

            it('/draw 1 should say "1 card"', function() {
                const handSize = this.player1.hand.length;
                this.game.chat('player1', '/draw 1');
                this.game.continue();
                expect(this.player1.hand.length).toBe(handSize + 1);
                expect(this.getChatLogs(3)).toContain('player1 uses the /draw command to draw 1 card to their hand');
            });
        });
    });
});
