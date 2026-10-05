describe('Magnificent Lighthouse', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDiscard: ['magnificent-lighthouse']
                },
                player2: {
                    conflictDiscard: ['assassination', 'charge', 'banzai'],
                    dynastyDiscard: ['doji-whisperer', 'shiba-tsukune']
                }
            });
            this.lighthouse = this.player1.placeCardInProvince('magnificent-lighthouse', 'province 1');
            this.assassination = this.player2.findCardByName('assassination');
            this.charge = this.player2.findCardByName('charge');
            this.banzai = this.player2.findCardByName('banzai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.tsukune = this.player2.findCardByName('shiba-tsukune');
            this.player2.reduceDeckToNumber('conflict deck', 0);
        });

        describe('with 3 cards in the deck', function() {
            beforeEach(function() {
                this.player2.moveCard(this.banzai, 'conflict deck');
                this.player2.moveCard(this.charge, 'conflict deck');
                this.player2.moveCard(this.assassination, 'conflict deck');
                this.player1.clickCard(this.lighthouse);
                this.player1.clickPrompt('Conflict Deck');
            });

            it('should discard one, put one on the bottom and leave the other on top', function() {
                expect(this.player1).toHavePrompt('Select a card to discard');
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('Charge!');
                expect(this.player1).toHavePromptButton('Banzai!');
                expect(this.player1).not.toHavePromptButton('None');
                this.player1.clickPrompt('Charge!');
                expect(this.charge.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Select a card to put on the bottom of the deck');
                expect(this.player1).not.toHavePromptButton('Charge!');
                expect(this.player1).not.toHavePromptButton('None');
                this.player1.clickPrompt('Assassination');
                expect(this.player2.conflictDeck).toEqual([this.banzai, this.assassination]);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should report the discarded card and the card put on the bottom', function() {
                this.player1.clickPrompt('Charge!');
                this.player1.clickPrompt('Assassination');
                expect(this.getChatLogs(3)).toContain('player1 chooses to discard Charge!');
                expect(this.getChatLogs(3)).toContain('player1 places a card on the bottom of the deck');
            });
        });

        describe('with 2 cards in the deck', function() {
            beforeEach(function() {
                this.player2.moveCard(this.charge, 'conflict deck');
                this.player2.moveCard(this.assassination, 'conflict deck');
                this.player1.clickCard(this.lighthouse);
                this.player1.clickPrompt('Conflict Deck');
            });

            it('should allow skipping the bottom card after discarding', function() {
                expect(this.player1).toHavePromptButton('None');
                this.player1.clickPrompt('Charge!');
                expect(this.player1).toHavePrompt('Select a card to put on the bottom of the deck');
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('None');
                this.player1.clickPrompt('None');
                expect(this.charge.location).toBe('conflict discard pile');
                expect(this.player2.conflictDeck).toEqual([this.assassination]);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should require a bottom card after skipping the discard', function() {
                this.player1.clickPrompt('None');
                expect(this.player1).toHavePrompt('Select a card to put on the bottom of the deck');
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('Charge!');
                expect(this.player1).not.toHavePromptButton('None');
                this.player1.clickPrompt('Assassination');
                expect(this.player2.conflictDeck).toEqual([this.charge, this.assassination]);
                expect(this.player2).toHavePrompt('Action Window');
            });
        });

        describe('with 1 card in the deck', function() {
            beforeEach(function() {
                this.player2.moveCard(this.assassination, 'conflict deck');
                this.player1.clickCard(this.lighthouse);
                this.player1.clickPrompt('Conflict Deck');
            });

            it('should end after discarding it', function() {
                this.player1.clickPrompt('Assassination');
                expect(this.assassination.location).toBe('conflict discard pile');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should still allow skipping the bottom after skipping the discard', function() {
                this.player1.clickPrompt('None');
                expect(this.player1).toHavePrompt('Select a card to put on the bottom of the deck');
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('None');
                this.player1.clickPrompt('None');
                expect(this.player2.conflictDeck).toEqual([this.assassination]);
                expect(this.player2).toHavePrompt('Action Window');
            });
        });

        it('should use the dynasty deck and discard pile for the dynasty deck', function() {
            this.player2.reduceDeckToNumber('dynasty deck', 0);
            this.player2.moveCard(this.tsukune, 'dynasty deck');
            this.player2.moveCard(this.whisperer, 'dynasty deck');
            this.player1.clickCard(this.lighthouse);
            this.player1.clickPrompt('Dynasty Deck');
            this.player1.clickPrompt('Doji Whisperer');
            expect(this.whisperer.location).toBe('dynasty discard pile');
            this.player1.clickPrompt('Shiba Tsukune');
            expect(this.tsukune.location).toBe('dynasty deck');
            expect(this.player2.dynastyDeck).toEqual([this.tsukune]);
        });
    });
});
