describe('Duel results', function() {
    integration(function() {
        describe('a duel\'s game action', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer'],
                        conflictDeck: ['fine-katana', 'ornate-fan', 'banzai']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.opposingWhisperer = this.player2.findCardByName('doji-whisperer');
                this.whisperer.declareAbilities(() => {
                    this.whisperer.action('Test duel')
                        .initiateDuel(() => ({
                            type: 'political',
                            gameAction: this.game.actions.draw()
                        }));
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.whisperer],
                    defenders: [this.opposingWhisperer],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.whisperer);
                this.player1.clickCard(this.opposingWhisperer);
            });

            it('resolves the duel\'s game action when the duel has a winner', function() {
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.player1.hand.length).toBe(1);
            });

            it('does not resolve the duel\'s game action on a tie', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1.hand.length).toBe(0);
                expect(this.getChatLogs(3)).toContain('The duel has no effect');
            });
        });

        it('a prompt\'s chooser can be a player', function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                },
                player2: {
                    inPlay: ['brash-samurai']
                }
            });
            const whisperer = this.player1.findCardByName('doji-whisperer');
            whisperer.declareAbilities(() => {
                whisperer.action('Test chooser')
                    .chooseAction((context) => ({
                        player: context.player.opponent,
                        choices: {
                            'Gain 1 honor': this.game.actions.gainHonor(),
                            'Do nothing': this.game.actions.noAction()
                        }
                    }));
            });
            this.player1.clickCard(whisperer);
            expect(this.player1).not.toHavePromptButton('Gain 1 honor');
            expect(this.player2).toHavePromptButton('Gain 1 honor');
        });
    });
});
