describe('Agasha Swordsmith', function() {
    integration(function() {
        describe('Agasha Swordsmith\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-swordsmith'],
                        conflictDiscard: ['fine-katana', 'hurricane-punch', 'centipede-tattoo', 'mantra-of-fire', 'censure', 'ornate-fan']
                    },
                    player2: {
                    }
                });
                this.agashaSwordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                // the sixth card, an attachment too, stays on the bottom out of reach
                this.player1.reduceDeckToNumber('conflict deck', 0);
                ['fine-katana', 'hurricane-punch', 'centipede-tattoo', 'mantra-of-fire', 'censure', 'ornate-fan'].forEach((card) => this.player1.moveCard(card, 'conflict deck'));
            });

            it('should prompt tp choose from the top 5 cards for an attachment', function() {
                this.player1.clickCard(this.agashaSwordsmith);
                expect(this.player1).toHavePrompt('Select a card to reveal');
                expect(this.player1).toHaveDisabledPromptButton('Hurricane Punch');
                expect(this.player1).toHavePromptButton('Centipede Tattoo');
                expect(this.player1).toHaveDisabledPromptButton('Mantra of Fire');
                expect(this.player1).toHaveDisabledPromptButton('Censure');
                expect(this.player1).toHavePromptButton('Ornate Fan');
                expect(this.player1).not.toHavePromptButton('Fine Katana');
                expect(this.player1.conflictDeck.at(-1)).toBe(this.fineKatana);
            });

            it('should reveal the chosen attachment', function() {
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('Ornate Fan');
                expect(this.getChatLogs(2)).toContain('player1 takes Ornate Fan');
            });

            it('should add the chosen card to your hand', function() {
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('Ornate Fan');
                expect(this.ornateFan.location).toBe('hand');
            });

            it('should shuffle the conflict deck', function() {
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('Ornate Fan');
                expect(this.getChatLogs(1)).toContain('player1 is shuffling their conflict deck');
            });

            it('should allow you to choose to take nothing', function() {
                this.player1.clickCard(this.agashaSwordsmith);
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Take nothing');
                expect(this.getChatLogs(2)).toContain('player1 takes nothing');
                expect(this.getChatLogs(1)).toContain('player1 is shuffling their conflict deck');
            });
        });
    });
});
