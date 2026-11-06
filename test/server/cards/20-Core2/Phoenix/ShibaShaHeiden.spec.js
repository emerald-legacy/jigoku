describe('Shiba-sha Heiden', function () {
    integration(function () {
        describe('Thriving', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        dynastyDeck: ['shiba-sha-heiden'],
                        provinces: ['pilgrimage'],
                        dynastyDiscard: ['doji-whisperer']
                    }
                });

                this.shibaShaHeiden = this.player1.placeCardInProvince('shiba-sha-heiden', 'province 1');
                this.shibaShaHeiden.facedown = false;

                this.prov1 = this.player1.findCardByName('pilgrimage');
                this.dojiWhisperer = this.player1.moveCard('doji-whisperer', 'dynasty deck');
            });

            it('fills province with extra card on dynasty phase start', function () {
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.dojiWhisperer.location).toBe('province 1');
                expect(this.dojiWhisperer.facedown).toBe(true);
                expect(this.getChatLogs(5)).toContain(
                    'player1 places a card facedown in province 1 due to Shiba-sha Heiden\'s Thriving'
                );
            });
        });

        describe('Resource Swap action', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        hand: ['fine-katana', 'ornate-fan'],
                        dynastyDeck: ['shiba-sha-heiden']
                    }
                });

                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.shibaShaHeiden = this.player1.placeCardInProvince('shiba-sha-heiden', 'province 1');
                this.shibaShaHeiden.facedown = false;
            });

            it('trades cards for fate', function () {
                const initialFate = this.player1.fate;
                const initialHandSize = this.player1.hand.length;
                this.player1.clickCard(this.shibaShaHeiden);
                expect(this.player1).toHavePrompt('Select one');
                expect(this.player1).toHavePromptButton('Gain 1 fate');
                expect(this.player1).toHavePromptButton('Draw a card');
                this.player1.clickPrompt('Gain 1 fate');
                expect(this.player1).toHavePrompt('Choose a cost to pay');
                expect(this.player1).toHavePromptButton('Spend 1 fate');
                expect(this.player1).toHavePromptButton('Discard a card');
                this.player1.clickPrompt('Discard a card');
                this.player1.clickCard(this.fineKatana);

                expect(this.fineKatana.location).toBe('conflict discard pile');
                expect(this.player1.fate).toBe(initialFate + 1);
                expect(this.player1.hand.length).toBe(initialHandSize - 1);
                expect(this.getChatLogs(5)).toContain('player1 uses Shiba-sha Heiden, discarding Fine Katana to gain 1 fate');
            });

            it('trades fate for cards', function () {
                const initialFate = this.player1.fate;
                const initialHandSize = this.player1.hand.length;
                this.player1.clickCard(this.shibaShaHeiden);
                this.player1.clickPrompt('Draw a card');
                this.player1.clickPrompt('Spend 1 fate');
                expect(this.player1.fate).toBe(initialFate - 1);
                expect(this.player1.hand.length).toBe(initialHandSize + 1);
                expect(this.getChatLogs(5)).toContain('player1 uses Shiba-sha Heiden, spending 1 fate to draw 1 card');
            });

            it('trades cards for cards', function () {
                const initialFate = this.player1.fate;
                const initialHandSize = this.player1.hand.length;
                this.player1.clickCard(this.shibaShaHeiden);
                this.player1.clickPrompt('Draw a card');
                this.player1.clickPrompt('Discard a card');
                this.player1.clickCard(this.fineKatana);

                expect(this.fineKatana.location).toBe('conflict discard pile');
                expect(this.player1.fate).toBe(initialFate);
                expect(this.player1.hand.length).toBe(initialHandSize);
                expect(this.getChatLogs(5)).toContain('player1 uses Shiba-sha Heiden, discarding Fine Katana to draw 1 card');
            });

            it('can spend 1 fate to gain 1 fate', function () {
                const initialFate = this.player1.fate;
                const initialHandSize = this.player1.hand.length;
                this.player1.clickCard(this.shibaShaHeiden);
                this.player1.clickPrompt('Gain 1 fate');
                this.player1.clickPrompt('Spend 1 fate');
                expect(this.player1.fate).toBe(initialFate);
                expect(this.player1.hand.length).toBe(initialHandSize);
                expect(this.getChatLogs(5)).toContain('player1 uses Shiba-sha Heiden, spending 1 fate to gain 1 fate');
            });

            it('cannot use multiples at same round', function () {
                this.player1.clickCard(this.shibaShaHeiden);
                this.player1.clickPrompt('Draw a card');
                this.player1.clickPrompt('Discard a card');
                this.player1.clickCard(this.fineKatana);
                expect(this.fineKatana.location).toBe('conflict discard pile');

                this.player2.pass();

                const fate = this.player1.fate;
                const handSize = this.player1.hand.length;
                this.player1.clickCard(this.shibaShaHeiden);
                expect(this.player1).not.toHavePrompt('Select one');
                expect(this.player1).not.toHavePrompt('Choose a cost to pay');
                expect(this.player1.fate).toBe(fate);
                expect(this.player1.hand.length).toBe(handSize);
            });
        });
    });
});
