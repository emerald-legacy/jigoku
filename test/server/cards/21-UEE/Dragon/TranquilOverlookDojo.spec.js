describe('Tranquil Overlook Dojo', function() {
    integration(function() {
        describe('during a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'tranquil-overlook-dojo',
                        inPlay: ['doji-challenger', 'doji-whisperer']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger'],
                        hand: ['let-go', 'banzai']
                    }
                });
                this.dojo = this.player1.findCardByName('tranquil-overlook-dojo');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.opponentWhisperer = this.player2.findCardByName('doji-whisperer');
                this.opponentChallenger = this.player2.findCardByName('doji-challenger');
                this.letGo = this.player2.findCardByName('let-go');
                this.banzai = this.player2.findCardByName('banzai');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger, this.whisperer],
                    defenders: [this.opponentWhisperer, this.opponentChallenger]
                });
                this.player2.pass();
            });

            it('offers a military and a political duel', function() {
                this.player1.clickCard(this.dojo);
                expect(this.player1).toHavePromptButton('Initiate a Military duel');
                expect(this.player1).toHavePromptButton('Initiate a Political duel');
            });

            it('lets the opponent choose the duel target, then the winner discards one of 2 revealed cards', function() {
                this.player1.clickCard(this.dojo);
                this.player1.clickPrompt('Initiate a Military duel');
                this.player1.clickCard(this.challenger);
                expect(this.player2).toBeAbleToSelect(this.opponentWhisperer);
                this.player2.clickCard(this.opponentWhisperer);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.dojo.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Choose a card to discard');
                expect(this.player1).toHavePromptButton('Let Go');
                expect(this.player1).toHavePromptButton('Banzai!');
                this.player1.clickPrompt('Let Go');
                expect(this.letGo.location).toBe('conflict discard pile');
                expect(this.banzai.location).toBe('hand');
                expect(this.getChatLogs(5)).toContain('player1 discards Let Go');
            });

            it('initiates a political duel', function() {
                this.player1.clickCard(this.dojo);
                this.player1.clickPrompt('Initiate a Political duel');
                this.player1.clickCard(this.challenger);
                this.player2.clickCard(this.opponentChallenger);
                expect(this.getChatLogs(3)).toContain('player1 uses Tranquil Overlook Dojo, bowing Tranquil Overlook Dojo to initiate a political duel : Doji Challenger vs. Doji Challenger');
            });

            it('does nothing more when the duel is lost', function() {
                this.player1.clickCard(this.dojo);
                this.player1.clickPrompt('Initiate a Military duel');
                this.player1.clickCard(this.whisperer);
                this.player2.clickCard(this.opponentChallenger);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1).not.toHavePrompt('Choose a card to discard');
                expect(this.letGo.location).toBe('hand');
                expect(this.banzai.location).toBe('hand');
            });
        });

        describe('outside a conflict', function() {
            it('cannot be used outside a conflict', function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'tranquil-overlook-dojo',
                        inPlay: ['doji-challenger']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['let-go', 'banzai']
                    }
                });
                this.dojo = this.player1.findCardByName('tranquil-overlook-dojo');
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.dojo);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.dojo.bowed).toBe(false);
            });
        });
    });
});
