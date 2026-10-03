describe('Test of Skill', function() {
    integration(function() {
        describe('without a duelist', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer'],
                        hand: ['test-of-skill'],
                        conflictDiscard: ['let-go', 'fine-katana', 'banzai', 'ornate-fan']
                    }
                });

                this.testOfSkill = this.player1.findCardByName('test-of-skill');
                this.player1.reduceDeckToNumber('conflict deck', 0);
                this.letGo = this.player1.moveCard('let-go', 'conflict deck');
                this.katana = this.player1.moveCard('fine-katana', 'conflict deck');
                this.banzai = this.player1.moveCard('banzai', 'conflict deck');
                this.fan = this.player1.moveCard('ornate-fan', 'conflict deck');
            });

            it('should ask for a card type', function() {
                this.player1.clickCard(this.testOfSkill);
                expect(this.player1).toHavePrompt('Select a card type');
                expect(this.player1).toHavePromptButton('attachment');
                expect(this.player1).toHavePromptButton('character');
                expect(this.player1).toHavePromptButton('event');
            });

            it('should let the player take two cards of the named type and discard the rest', function() {
                this.player1.clickCard(this.testOfSkill);
                this.player1.clickPrompt('attachment');
                expect(this.player1).toHavePrompt('Select a card');
                expect(this.player1).toHavePromptButton('Ornate Fan');
                expect(this.player1).toHavePromptButton('Fine Katana');
                expect(this.player1).not.toHavePromptButton('Banzai!');
                expect(this.player1).toHavePromptButton('Done');

                this.player1.clickPrompt('Ornate Fan');
                expect(this.fan.location).toBe('hand');
                expect(this.getChatLogs(1)).toContain('player1 adds Ornate Fan to their hand');
                expect(this.player1).toHavePrompt('Select a card');
                expect(this.player1).not.toHavePromptButton('Ornate Fan');

                this.player1.clickPrompt('Fine Katana');
                expect(this.katana.location).toBe('hand');
                expect(this.banzai.location).toBe('conflict discard pile');
                expect(this.letGo.location).toBe('conflict deck');
                expect(this.getChatLogs(2)).toContain('player1 discards Banzai!');
                expect(this.player1).not.toHavePrompt('Select a card');
            });

            it('should discard the rest when the player is done after one card', function() {
                this.player1.clickCard(this.testOfSkill);
                this.player1.clickPrompt('attachment');
                this.player1.clickPrompt('Fine Katana');
                this.player1.clickPrompt('Done');
                expect(this.katana.location).toBe('hand');
                expect(this.fan.location).toBe('conflict discard pile');
                expect(this.banzai.location).toBe('conflict discard pile');
                expect(this.player1).not.toHavePrompt('Select a card');
            });

            it('should discard every revealed card when the player is done at once', function() {
                this.player1.clickCard(this.testOfSkill);
                this.player1.clickPrompt('attachment');
                this.player1.clickPrompt('Done');
                expect(this.fan.location).toBe('conflict discard pile');
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.banzai.location).toBe('conflict discard pile');
            });

            it('should discard every revealed card without a prompt when none matches', function() {
                this.player1.clickCard(this.testOfSkill);
                this.player1.clickPrompt('character');
                expect(this.player1).not.toHavePrompt('Select a card');
                expect(this.fan.location).toBe('conflict discard pile');
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.banzai.location).toBe('conflict discard pile');
            });

            it('should stop after the only matching card', function() {
                this.player1.clickCard(this.testOfSkill);
                this.player1.clickPrompt('event');
                expect(this.player1).toHavePromptButton('Banzai!');
                expect(this.player1).not.toHavePromptButton('Let Go');
                this.player1.clickPrompt('Banzai!');
                expect(this.banzai.location).toBe('hand');
                expect(this.fan.location).toBe('conflict discard pile');
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.player1).not.toHavePrompt('Select a card');
            });
        });

        describe('with a duelist', function() {
            it('should reveal 4 cards', function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger'],
                        hand: ['test-of-skill'],
                        conflictDiscard: ['let-go', 'fine-katana', 'banzai', 'ornate-fan']
                    }
                });
                this.player1.reduceDeckToNumber('conflict deck', 0);
                this.player1.moveCard('let-go', 'conflict deck');
                this.player1.moveCard('fine-katana', 'conflict deck');
                this.player1.moveCard('banzai', 'conflict deck');
                this.player1.moveCard('ornate-fan', 'conflict deck');

                this.player1.clickCard('test-of-skill');
                this.player1.clickPrompt('event');
                expect(this.player1).toHavePromptButton('Banzai!');
                expect(this.player1).toHavePromptButton('Let Go');
            });
        });
    });
});
