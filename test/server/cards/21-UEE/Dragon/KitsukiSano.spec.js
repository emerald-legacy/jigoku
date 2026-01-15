describe('Kitsuki Sano', function() {
    integration(function() {
        describe('Card cycling effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-sano'],
                        hand: ['fine-katana','court-games', 'stowaway']
                    },
                    player2: {
                        inPlay: ['miya-mystic'],
                        hand: []
                    }
                });

                this.kitsukiSano = this.player1.findCardByName('kitsuki-sano');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.courtGames = this.player1.findCardByName('court-games');
                this.stowaway = this.player1.findCardByName('stowaway');

                this.miyaMystic = this.player2.findCardByName('miya-mystic');
                this.noMoreActions();
            });

            it('works when unopposed', function() {
                const initialHand = this.player1.hand.length;
                this.initiateConflict({
                    attackers: [this.kitsukiSano],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.kitsukiSano);
                expect(this.player1).toHavePrompt('Choose 2 cards to discard');
                expect(this.player1).toBeAbleToSelect(this.fineKatana);
                expect(this.player1).toBeAbleToSelect(this.courtGames);
                expect(this.player1).toBeAbleToSelect(this.stowaway);


                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.courtGames);
                this.player1.clickPrompt('Done');

                expect(this.getChatLogs(5)).toContain('player1 uses Kitsuki Sano to draw 2 cards');
                expect(this.fineKatana.location).toBe('conflict discard pile');
                expect(this.courtGames.location).toBe('conflict discard pile');
                expect(this.player1.hand.length).toBe(initialHand - 2 + 2);
            });

            it('does not work when opposed', function() {
                const initialHand = this.player1.hand.length;
                this.initiateConflict({
                    attackers: [this.kitsukiSano],
                    defenders: [this.miyaMystic]
                });
                this.player2.pass();
                this.player1.clickCard(this.kitsukiSano);
                expect(this.player1).not.toHavePrompt('Choose 2 cards to discard');
            });
        });
    });
});
