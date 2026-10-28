describe('Tattered Missive', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'brash-samurai'],
                    hand: ['tattered-missive'],
                    conflictDeck: ['banzai', 'fine-katana', 'ornate-fan', 'way-of-the-scorpion', 'assassination', 'court-games'],
                    conflictDeckSize: 6
                },
                player2: {
                    inPlay: ['ikoma-prodigy']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.prodigy = this.player2.findCardByName('ikoma-prodigy');
            this.missive = this.player1.findCardByName('tattered-missive');
            ['court-games', 'assassination', 'way-of-the-scorpion', 'ornate-fan', 'fine-katana', 'banzai'].forEach((name) => {
                this.player1.moveCard(name, 'conflict deck');
            });
        });

        it('can only be attached to a Courtier character you control', function() {
            this.player1.clickCard(this.missive);
            expect(this.player1).toHavePrompt('Tattered Missive');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.prodigy);
        });

        it('bows the attached character to search the top 5 cards for a card', function() {
            expect(this.player1.conflictDeck.map((card) => card.id)).toEqual(['banzai', 'fine-katana', 'ornate-fan', 'way-of-the-scorpion', 'assassination', 'court-games']);
            this.player1.playAttachment(this.missive, this.whisperer);
            this.player2.pass();
            this.player1.clickCard(this.missive);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.player1).toHavePromptButton('Banzai!');
            expect(this.player1).toHavePromptButton('Fine Katana');
            expect(this.player1).toHavePromptButton('Ornate Fan');
            expect(this.player1).toHavePromptButton('Way of the Scorpion');
            expect(this.player1).toHavePromptButton('Assassination');
            expect(this.player1).not.toHavePromptButton('Court Games');
            this.player1.clickPrompt('Assassination');
            expect(this.player1.findCardByName('assassination').location).toBe('hand');
            expect(this.player1.conflictDeck.length).toBe(5);
            expect(this.getChatLogs(5)).toContain('player1 uses Tattered Missive, bowing Doji Whisperer to look at the top 5 cards of their conflict deck');
            expect(this.getChatLogs(5)).toContain('player1 takes Assassination');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their conflict deck');
        });

        it('cannot be used while the attached character is bowed', function() {
            this.player1.playAttachment(this.missive, this.whisperer);
            this.player2.pass();
            this.player1.clickCard(this.missive);
            this.player1.clickPrompt('Banzai!');
            this.player2.pass();
            expect(this.whisperer.bowed).toBe(true);
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.missive);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player1.conflictDeck.length).toBe(5);
        });
    });
});
