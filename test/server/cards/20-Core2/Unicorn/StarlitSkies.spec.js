describe('Starlit Skies', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDiscard: ['starlit-skies'],
                    conflictDeck: ['fine-katana', 'ornate-fan', 'banzai']
                },
                player2: {}
            });

            this.skies = this.player1.placeCardInProvince('starlit-skies', 'province 1');
            this.katana = this.player1.findCardByName('fine-katana', 'conflict deck');
            this.fan = this.player1.findCardByName('ornate-fan', 'conflict deck');
            this.banzai = this.player1.findCardByName('banzai', 'conflict deck');
            this.player1.moveCard(this.banzai, 'conflict deck');
            this.player1.moveCard(this.fan, 'conflict deck');
            this.player1.moveCard(this.katana, 'conflict deck');
        });

        it('should discard one card and put another on the bottom of the deck', function () {
            this.player1.clickCard(this.skies);
            expect(this.player1).toHavePrompt('Choose which deck to look at:');
            expect(this.player1).toHavePromptButton('Your Dynasty Deck');
            this.player1.clickPrompt('Your Conflict Deck');

            expect(this.player1).toHavePrompt('Select a card to discard');
            expect(this.player1).not.toHavePromptButton('None');
            this.player1.clickPrompt('Fine Katana');
            expect(this.katana.location).toBe('conflict discard pile');

            expect(this.player1).toHavePrompt('Select a card to put on the bottom of the deck');
            expect(this.player1).not.toHavePromptButton('None');
            expect(this.player1).not.toHavePromptButton('Fine Katana');
            this.player1.clickPrompt('Ornate Fan');

            const deck = this.player1.conflictDeck;
            expect(deck[0]).toBe(this.banzai);
            expect(deck[deck.length - 1]).toBe(this.fan);
            expect(this.getChatLogs(5)).toContain('player1 chooses to discard Fine Katana');
            expect(this.getChatLogs(5)).toContain('player1 places a card on the bottom of the deck');
            expect(this.player2).toHavePrompt('Action Window');
        });

        describe('with two cards in the deck', function () {
            beforeEach(function () {
                this.player1.reduceDeckToNumber('conflict deck', 2);
            });

            it('should skip the discard and offer no None for the bottom', function () {
                this.player1.clickCard(this.skies);
                this.player1.clickPrompt('Your Conflict Deck');
                expect(this.player1).toHavePrompt('Select a card to discard');
                this.player1.clickPrompt('None');

                expect(this.player1).toHavePrompt('Select a card to put on the bottom of the deck');
                expect(this.player1).not.toHavePromptButton('None');
                expect(this.player1).toHavePromptButton('Fine Katana');
                this.player1.clickPrompt('Fine Katana');

                expect(this.player1.conflictDeck).toEqual([this.fan, this.katana]);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should offer None for the bottom after a discard', function () {
                this.player1.clickCard(this.skies);
                this.player1.clickPrompt('Your Conflict Deck');
                this.player1.clickPrompt('Fine Katana');

                expect(this.player1).toHavePrompt('Select a card to put on the bottom of the deck');
                expect(this.player1).toHavePromptButton('Ornate Fan');
                this.player1.clickPrompt('None');

                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.player1.conflictDeck).toEqual([this.fan]);
                expect(this.player2).toHavePrompt('Action Window');
            });
        });

        describe('with one card in the deck', function () {
            beforeEach(function () {
                this.player1.reduceDeckToNumber('conflict deck', 1);
            });

            it('should let you skip both', function () {
                this.player1.clickCard(this.skies);
                this.player1.clickPrompt('Your Conflict Deck');
                this.player1.clickPrompt('None');

                expect(this.player1).toHavePrompt('Select a card to put on the bottom of the deck');
                expect(this.player1).toHavePromptButton('Fine Katana');
                this.player1.clickPrompt('None');

                expect(this.player1.conflictDeck).toEqual([this.katana]);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should still prompt for the bottom after discarding the only card', function () {
                this.player1.clickCard(this.skies);
                this.player1.clickPrompt('Your Conflict Deck');
                this.player1.clickPrompt('Fine Katana');

                expect(this.player1).toHavePrompt('Select a card to put on the bottom of the deck');
                this.player1.clickPrompt('None');

                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.player2).toHavePrompt('Action Window');
            });
        });
    });
});
