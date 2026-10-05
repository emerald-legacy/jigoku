describe('Truthseeker', function() {
    integration(function() {
        describe('Truthseeker\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['truthseeker'],
                        hand: ['assassination', 'fine-katana', 'ornate-fan']
                    },
                    player2: {
                        inPlay: ['asahina-artisan'],
                        hand: ['let-go', 'banzai', 'way-of-the-crane']
                    }
                });
                this.truthseeker = this.player1.placeCardInProvince('truthseeker', 'province 1');
                this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
                this.fineKatana = this.player1.moveCard('fine-katana', 'conflict deck');
                this.assassination = this.player1.moveCard('assassination', 'conflict deck');
            });

            it('should be allowed to trigger as soon as the character enters play', function () {
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.truthseeker);
            });

            it('should give each player\'s decks as options for the target', function () {
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.truthseeker);

                this.player1.clickCard(this.truthseeker);
                expect(this.player1).toHavePrompt('Choose which deck to look at:');
                expect(this.player1).toHavePromptButton('player1\'s Dynasty');
                expect(this.player1).toHavePromptButton('player1\'s Conflict');
                expect(this.player1).toHavePromptButton('player2\'s Dynasty');
                expect(this.player1).toHavePromptButton('player2\'s Conflict');
            });

            it('should let you order the top 3 cards', function () {
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('1');
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('player1\'s Conflict');
                expect(this.player1).toHavePrompt('Select the card you would like to place on top of the deck');
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('Ornate Fan');
                expect(this.player1).toHavePromptButton('Fine Katana');
                this.player1.clickPrompt('Fine Katana');
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('Ornate Fan');
                this.player1.clickPrompt('Ornate Fan');
                expect(this.player2).toHavePrompt('Play cards from provinces');

                const topCards = this.player1.conflictDeck.slice(0, 3);

                expect(topCards[0]).toBe(this.fineKatana);
                expect(topCards[1]).toBe(this.ornateFan);
                expect(topCards[2]).toBe(this.assassination);
            });

            it('should name the deck and ask for the second card', function () {
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('1');
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('player1\'s Conflict');
                expect(this.getChatLogs(3)).toContain('player1 uses Truthseeker to look at the top 3 cards of player1\'s conflict deck');
                this.player1.clickPrompt('Assassination');
                expect(this.player1).toHavePrompt('Which card do you want to be the second card?');
                expect(this.player1).not.toHavePromptButton('Assassination');
            });

            it('should order the top 3 cards of the opponent\'s deck', function () {
                this.letGo = this.player2.moveCard('let-go', 'conflict deck');
                this.banzai = this.player2.moveCard('banzai', 'conflict deck');
                this.wayOfTheCrane = this.player2.moveCard('way-of-the-crane', 'conflict deck');
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('1');
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('player2\'s Conflict');
                expect(this.getChatLogs(3)).toContain('player1 uses Truthseeker to look at the top 3 cards of player2\'s conflict deck');
                expect(this.player1).toHavePromptButton('Way of the Crane');
                expect(this.player1).toHavePromptButton('Banzai!');
                expect(this.player1).toHavePromptButton('Let Go');
                this.player1.clickPrompt('Let Go');
                this.player1.clickPrompt('Way of the Crane');

                const topCards = this.player2.conflictDeck.slice(0, 3);
                expect(topCards[0]).toBe(this.letGo);
                expect(topCards[1]).toBe(this.wayOfTheCrane);
                expect(topCards[2]).toBe(this.banzai);
            });

            it('should still prompt with a single card in the deck', function () {
                this.player1.reduceDeckToNumber('conflict deck', 0);
                this.fineKatana = this.player1.moveCard('fine-katana', 'conflict deck');
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('1');
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('player1\'s Conflict');
                expect(this.player1).toHavePrompt('Select the card you would like to place on top of the deck');
                this.player1.clickPrompt('Fine Katana');
                expect(this.player1.conflictDeck.length).toBe(1);
                expect(this.player1.conflictDeck[0]).toBe(this.fineKatana);
                expect(this.player2).toHavePrompt('Play cards from provinces');
            });
        });
    });
});

