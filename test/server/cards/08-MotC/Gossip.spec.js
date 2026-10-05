describe('Gossip', function() {
    integration(function() {
        describe('Gossip\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['gossip']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['against-the-waves', 'fine-katana', 'kami-unleashed'],
                        dynastyDiscard: ['hidden-moon-dojo', 'solemn-scholar']
                    }
                });

                this.adept = this.player2.findCardByName('adept-of-the-waves');
                this.againstTheWaves = this.player2.findCardByName('against-the-waves');
                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.kamiUnleashed = this.player2.findCardByName('kami-unleashed');
            });

            it('should stop your opponent from playing events', function() {
                this.player1.clickCard('gossip');
                this.player1.chooseCardInPrompt(this.againstTheWaves.name, 'card-name');
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.againstTheWaves);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('opponent should not be able to play copies of attachments', function() {
                this.player1.clickCard('gossip');
                this.player1.chooseCardInPrompt(this.fineKatana.name, 'card-name');
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.fineKatana);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('opponent should not be able to play copies of characters', function() {
                this.player1.clickCard('gossip');
                this.player1.chooseCardInPrompt(this.kamiUnleashed.name, 'card-name');
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.kamiUnleashed);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should stop your opponent from playing characters of HMD', function() {
                this.solemnScholar = this.player2.placeCardInProvince('solemn-scholar', 'province 1');
                this.hiddenMoonDojo = this.player2.placeCardInProvince('hidden-moon-dojo', 'province 2');
                this.player1.clickCard('gossip');
                this.player1.chooseCardInPrompt(this.solemnScholar.name, 'card-name');
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.solemnScholar);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should name the card when played and log the effect', function() {
                this.player1.clickCard('gossip');
                expect(this.player1).toHavePrompt('Name a card');
                this.player1.chooseCardInPrompt(this.againstTheWaves.name, 'card-name');
                expect(this.getChatLogs(3)).toContain('player1 plays Gossip, naming Against the Waves to prevent player2 from playing cards named Against the Waves from their hand this phase');
            });

            it('should still let your opponent play other cards', function() {
                this.player1.clickCard('gossip');
                this.player1.chooseCardInPrompt(this.againstTheWaves.name, 'card-name');
                this.player2.clickCard(this.fineKatana);
                expect(this.player2).toHavePrompt('Fine Katana');
            });
        });
    });
});
